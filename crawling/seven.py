import requests
import json
import time
from datetime import datetime
import oracledb

class KakaoMapCrawler:
    def __init__(self, api_key, db_config, base_url="https://dapi.kakao.com/v2/local/search/category.json"):
        """
        KakaoMapCrawler를 초기화합니다.
        :param api_key: 카카오 개발자 REST API 키
        :param db_config: Oracle DB 연결 설정 딕셔너리 (user, password, dsn)
        :param base_url: 카카오 로컬 검색 API 기본 URL
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"KakaoAK {self.api_key}",
            "Accept": "application/json"
        }
        
        # Oracle DB 연결 설정
        self.db_config = db_config
        self.connection = None # DB 연결 객체

        # 7번 국도를 따라 주요 도시/지점의 좌표
        self.locations = [
            {"name": "부산", "latitude": 35.166668, "longitude": 129.066666},
            {"name": "양산", "latitude": 35.333333, "longitude": 129.033333},
            {"name": "울산", "latitude": 35.538333, "longitude": 129.311389},
            {"name": "경주", "latitude": 35.835354, "longitude": 129.263885},
            {"name": "포항", "latitude": 36.02917, "longitude": 129.36481},
            {"name": "영덕", "latitude": 36.416667, "longitude": 129.366667},
            {"name": "울진", "latitude": 36.9930661, "longitude": 129.4004195},
            {"name": "삼척", "latitude": 37.450, "longitude": 129.165},
            {"name": "동해", "latitude": 37.5247192, "longitude": 129.1142915},
            {"name": "강릉", "latitude": 37.751853, "longitude": 128.8760574},
            {"name": "양양", "latitude": 38.019278, "longitude": 128.495417},
            {"name": "속초", "latitude": 38.2, "longitude": 128.6},
            {"name": "고성 (강원)", "latitude": 38.333333, "longitude": 128.500000}
        ]
        self.category_codes = ["FD6"] # 음식점
        self.radius = 1000 # 검색 반경 (미터)

    def connect_db(self):
        """Oracle 데이터베이스에 연결합니다."""
        try:
            # Instant Client 라이브러리 경로가 필요한 경우 아래 주석 해제 및 경로 수정
            # oracledb.init_oracle_client(lib_dir="/path/to/oracle/instantclient")
            self.connection = oracledb.connect(
                user=self.db_config['user'],
                password=self.db_config['password'],
                dsn=self.db_config['dsn']
            )
            print("Oracle DB에 성공적으로 연결되었습니다.")
        except oracledb.Error as e:
            error_obj, = e.args
            print(f"Oracle DB 연결 오류: {error_obj.message}")
            self.connection = None # 연결 실패 시 connection 초기화
            raise # 오류 발생 시 상위로 전파

    def close_db(self):
        """Oracle 데이터베이스 연결을 닫습니다."""
        if self.connection:
            self.connection.close()
            print("Oracle DB 연결이 종료되었습니다.")

    def restaurant_exists(self, cursor, name, address):
        """
        데이터베이스에 이미 동일한 이름과 주소를 가진 음식점이 있는지 확인합니다.
        :param cursor: DB 커서 객체
        :param name: 음식점 이름
        :param address: 음식점 주소
        :return: 존재하면 True, 아니면 False
        """
        try:
            sql = "SELECT COUNT(*) FROM TB_RESTAURANT WHERE RESTAURANT_NAME = :name AND RESTAURANT_ADDRESS = :address"
            cursor.execute(sql, name=name, address=address)
            count = cursor.fetchone()[0]
            return count > 0
        except oracledb.Error as e:
            error_obj, = e.args
            print(f"음식점 중복 확인 중 오류 발생: {error_obj.message}")
            return False # 오류 발생 시 중복되지 않은 것으로 간주 (혹은 True로 처리하여 삽입 방지)

    def insert_restaurant(self, cursor, restaurant_info):
        """
        음식점 정보를 데이터베이스에 삽입합니다.
        :param cursor: DB 커서 객체
        :param restaurant_info: 삽입할 음식점 정보 딕셔너리
        """
        sql = """
        INSERT INTO TB_RESTAURANT (
            RESTAURANT_NAME, RESTAURANT_ADDRESS, RESTAURANT_PHONE_NUMBER,
            RESTAURANT_CATEGORY, RESTAURANT_LATITUDE, RESTAURANT_LONGITUDE,
            CREATED_DATE, CREATED_ID, UPDATED_DATE, UPDATED_ID
            -- Kakao API에서 직접 제공하지 않는 필드는 현재 NULL로 처리합니다.
            -- RESTAURANT_OPEN_HOURS, RESTAURANT_BREAK_TIME, RESTAURANT_HOLIDAY,
            -- RESTAURANT_PARKING_INFO, RESTAURANT_AVERAGE_RATING, RESTAURANT_REVIEW_COUNT
        ) VALUES (
            :restaurantName, :restaurantAddress, :restaurantPhoneNumber,
            :restaurantCategory, :restaurantLatitude, :restaurantLongitude,
            TO_DATE(:createdDate, 'YYYY-MM-DD'), :createdId, TO_DATE(:updatedDate, 'YYYY-MM-DD'), :updatedId
        )
        """
        try:
            cursor.execute(sql, {
                'restaurantName': restaurant_info.get('restaurantName'),
                'restaurantAddress': restaurant_info.get('restaurantAddress'),
                'restaurantPhoneNumber': restaurant_info.get('restaurantPhoneNumber'),
                'restaurantCategory': restaurant_info.get('restaurantCategory'),
                'restaurantLatitude': restaurant_info.get('restaurantLatitude'),
                'restaurantLongitude': restaurant_info.get('restaurantLongitude'),
                'createdDate': restaurant_info.get('createdDate'),
                'createdId': restaurant_info.get('createdId'),
                'updatedDate': restaurant_info.get('updatedDate'),
                'updatedId': restaurant_info.get('updatedId')
            })
            return True
        except oracledb.Error as e:
            error_obj, = e.args
            # ORA-00001: unique constraint (...) violated 에러는 중복 삽입 시 발생
            if error_obj.code == 1:
                print(f"  이미 존재하는 맛집 (DB 중복): {restaurant_info.get('restaurantName')} - {restaurant_info.get('restaurantAddress')}")
            else:
                print(f"  DB 삽입 오류: {error_obj.message} - 데이터: {restaurant_info.get('restaurantName')}")
            return False

    def crawl_restaurants(self):
        """
        정의된 각 위치 주변의 음식점 정보를 카카오맵 API를 통해 크롤링하고 DB에 저장합니다.
        """
        newly_saved_count = 0
        if not self.connection:
            print("DB 연결이 설정되지 않아 크롤링을 시작할 수 없습니다.")
            return newly_saved_count

        cursor = None
        try:
            cursor = self.connection.cursor()
            for location in self.locations:
                print(f"\n--- 위치 처리 중: {location['name']} ---")
                for category_code in self.category_codes:
                    page = 1
                    is_end = False
                    while not is_end:
                        params = {
                            "category_group_code": category_code,
                            "y": location['latitude'],
                            "x": location['longitude'],
                            "radius": self.radius,
                            "page": page,
                            "size": 15
                        }
                        # print(f"  API 호출 중: {location['name']}, {page} 페이지...")
                        try:
                            response = requests.get(self.base_url, headers=self.headers, params=params)
                            response.raise_for_status()
                            data = response.json()

                            if not data.get('documents'):
                                # print(f"    {location['name']}의 {category_code} 카테고리에서 {page} 페이지에 음식점 데이터가 없습니다.")
                                is_end = True
                                continue

                            for doc in data['documents']:
                                restaurant_info = {
                                    "restaurantName": doc.get('place_name'),
                                    "restaurantAddress": doc.get('road_address_name') or doc.get('address_name'),
                                    "restaurantPhoneNumber": doc.get('phone'),
                                    "restaurantCategory": doc.get('category_name'),
                                    "restaurantLatitude": float(doc.get('y')),
                                    "restaurantLongitude": float(doc.get('x')),
                                    "createdDate": datetime.now().strftime("%Y-%m-%d"),
                                    "createdId": "system_crawler_7road",
                                    "updatedDate": datetime.now().strftime("%Y-%m-%d"),
                                    "updatedId": "system_crawler_7road"
                                }

                                # DB에 이미 존재하는지 확인 후 삽입
                                if not self.restaurant_exists(cursor, restaurant_info['restaurantName'], restaurant_info['restaurantAddress']):
                                    if self.insert_restaurant(cursor, restaurant_info):
                                        newly_saved_count += 1
                                        print(f"  새로운 맛집 저장: {restaurant_info['restaurantName']} - {restaurant_info['restaurantAddress']}")
                                else:
                                    print(f"  이미 존재하는 맛집 (크롤러 중복 확인): {restaurant_info['restaurantName']} - {restaurant_info['restaurantAddress']}")
                                    
                            self.connection.commit() # 트랜잭션 커밋
                            is_end = data['meta']['is_end']
                            page += 1

                            if not is_end:
                                time.sleep(0.5)

                        except requests.exceptions.HTTPError as http_err:
                            print(f"    HTTP 오류 발생: {http_err} - 응답: {response.text}")
                            is_end = True
                            self.connection.rollback() # 오류 시 롤백
                        except requests.exceptions.ConnectionError as conn_err:
                            print(f"    연결 오류 발생: {conn_err}")
                            is_end = True
                            self.connection.rollback()
                        except json.JSONDecodeError as json_err:
                            print(f"    JSON 디코드 오류: {json_err} - 응답: {response.text}")
                            is_end = True
                            self.connection.rollback()
                        except Exception as err:
                            print(f"    예상치 못한 오류 발생: {err}")
                            is_end = True
                            self.connection.rollback()
        finally:
            if cursor:
                cursor.close()
        return newly_saved_count

if __name__ == "__main__":
    # 1. 카카오 REST API 키 설정 (필수)
    KAKAO_API_KEY = "3d0097c2b1a5131da26af9e3d3ed09f7" # 여기에 실제 키 입력

    # 2. Oracle DB 연결 정보 설정 (필수)
    # TNSName 방식 (tnsnames.ora 파일 사용):
    # DSN_STRING = "your_tns_name"
    # 또는 EZConnect 방식 (가장 일반적):
    # DSN_STRING = "hostname:port/service_name" 예: "localhost:1521/XEPDB1"
    # DSN_STRING = "oracle.example.com:1521/orclpdb1"
    
    # Oracle Cloud Autonomous Database 연결 예시 (Wallet 파일 필요)
    # lib_dir로 wallet 파일이 있는 디렉토리를 지정해야 합니다.
    # dsn= "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=example.adb.oraclecloud.com))(connect_data=(service_name=example_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=true)))"
    
    DB_CONFIG = {
        'user': "seven",    # Oracle DB 사용자 이름
        'password': "7777", # Oracle DB 비밀번호
        'dsn': "116.36.205.25:1524/XE" # Oracle DSN (Data Source Name)
    }

    # Instant Client 라이브러리 경로 설정 (필요한 경우만 사용)
    # oracledb.init_oracle_client(lib_dir="C:/oracle/instantclient_21_9") # Windows 예시
    # oracledb.init_oracle_client(lib_dir="/opt/oracle/instantclient_21_9") # Linux 예시

    if KAKAO_API_KEY == "YOUR_KAKAO_API_KEY":
        print("오류: 'YOUR_KAKAO_API_KEY'를 실제 카카오 REST API 키로 교체해주세요.")
        print("키는 https://developers.kakao.com/ 에서 얻을 수 있습니다.")
    elif DB_CONFIG['user'] == "YOUR_DB_USERNAME":
        print("오류: 'DB_CONFIG'에 Oracle DB 연결 정보를 올바르게 설정해주세요.")
    else:
        crawler = KakaoMapCrawler(api_key=KAKAO_API_KEY, db_config=DB_CONFIG)
        try:
            crawler.connect_db() # DB 연결 시도
            newly_saved_count = crawler.crawl_restaurants()
            print(f"\n--- 크롤링 및 DB 등록 완료 ---")
            print(f"총 {newly_saved_count}개의 새로운 음식점이 DB에 저장되었습니다.")
        except Exception as e:
            print(f"\n--- 오류 발생 ---")
            print(f"크롤링 또는 DB 처리 중 오류 발생: {e}")
        finally:
            crawler.close_db() # DB 연