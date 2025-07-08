import requests
import json
import time
from datetime import datetime
import oracledb
import random # random 모듈 추가

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
            # 주소 파싱 후 ADDR_DETAIL을 기준으로 중복 체크
            parsed_address = self._parse_address(address)
            sql = """
            SELECT COUNT(*) FROM TB_RESTAURANT
            WHERE RESTAURANT_NAME = :name
            AND ADDR_SIDO = :sido
            AND ADDR_SIGUNGU = :sigungu
            AND ADDR_DONG = :dong
            AND ADDR_DETAIL = :detail
            """
            cursor.execute(sql,
                           name=name,
                           sido=parsed_address['sido'],
                           sigungu=parsed_address['sigungu'],
                           dong=parsed_address['dong'],
                           detail=parsed_address['detail'])
            count = cursor.fetchone()[0]
            return count > 0
        except oracledb.Error as e:
            error_obj, = e.args
            print(f"음식점 중복 확인 중 오류 발생: {error_obj.message}")
            return False # 오류 발생 시 중복되지 않은 것으로 간주 (혹은 True로 처리하여 삽입 방지)

    # _generate_random_phone_number 메서드는 사용자가 제외를 요청했으므로 삭제

    def _parse_address(self, full_address):
        """
        전체 주소 문자열을 시/도, 시/군/구, 동, 상세 주소로 파싱합니다.
        한국 주소 체계를 고려하여 최대한 정교하게 파싱 시도.
        """
        parts = full_address.split()
        sido = ""
        sigungu = ""
        dong = ""
        detail = full_address # 기본적으로 전체를 detail로 설정

        if not parts:
            return {'sido': None, 'sigungu': None, 'dong': None, 'detail': None}

        # 시/도 추출 (첫 번째 부분, '특별시', '광역시', '도', '특별자치시' 등 포함)
        if "특별시" in parts[0] or "광역시" in parts[0] or "도" in parts[0] or "특별자치시" in parts[0]:
            sido = parts[0]
            parts = parts[1:] # 시/도를 제외한 나머지
        elif len(parts) > 0 and (parts[0].endswith("시") or parts[0].endswith("도")): # '서울시', '경기도' 등
            sido = parts[0]
            parts = parts[1:]
        elif len(parts) > 1 and (parts[0] + ' ' + parts[1]).endswith("특별시") or \
             (parts[0] + ' ' + parts[1]).endswith("광역시") or \
             (parts[0] + ' ' + parts[1]).endswith("특별자치도"): # '세종 특별자치시', '제주 특별자치도'
            sido = parts[0] + ' ' + parts[1]
            parts = parts[2:]


        # 시/군/구 추출 (두 번째 부분)
        if len(parts) > 0:
            if parts[0].endswith("시") or parts[0].endswith("군") or parts[0].endswith("구"):
                sigungu = parts[0]
                parts = parts[1:]
            elif len(parts) > 1 and parts[1].endswith("읍") or parts[1].endswith("면") or parts[1].endswith("동"):
                # 예: '세종 조치원읍' 같은 경우 두번째가 읍/면/동이면 두번째까지 시군구로 포함 안함
                pass # 처리하지 않고 다음 동/읍/면으로 넘어감
            elif len(parts) > 1 and (parts[0] + ' ' + parts[1]).endswith("시") or \
                 (parts[0] + ' ' + parts[1]).endswith("군") or \
                 (parts[0] + ' ' + parts[1]).endswith("구"): # '수원 장안구'
                sigungu = parts[0] + ' ' + parts[1]
                parts = parts[2:]


        # 동/읍/면 추출 (세 번째 부분)
        if len(parts) > 0:
            if parts[0].endswith("동") or parts[0].endswith("읍") or parts[0].endswith("면") or parts[0].endswith("가"):
                dong = parts[0]
                parts = parts[1:]
            elif len(parts) > 1 and (parts[0] + ' ' + parts[1]).endswith("동") or \
                 (parts[0] + ' ' + parts[1]).endswith("읍") or \
                 (parts[0] + ' ' + parts[1]).endswith("면"): # '이태원 1동'
                dong = parts[0] + ' ' + parts[1]
                parts = parts[2:]


        # 나머지 부분을 상세 주소로 간주
        detail = " ".join(parts)

        return {
            'sido': sido if sido else None,
            'sigungu': sigungu if sigungu else None,
            'dong': dong if dong else None,
            'detail': detail if detail else None
        }

    def _parse_operating_hours(self, hours_string):
        """
        영업 시간 문자열을 파싱하여 시작/종료 시간 및 분, 브레이크 타임, 휴무일 정보를 딕셔너리로 반환합니다.
        '정보 없음' 또는 None인 경우 랜덤 값을 생성합니다.
        """
        open_hour, open_minute, close_hour, close_minute = None, None, None, None
        break_start_hour, break_start_minute, break_end_hour, break_end_minute = None, None, None, None
        holiday = None

        if not hours_string or "정보 없음" in hours_string:
            # 랜덤한 영업 시간 생성 (예: 오전 8시 ~ 오후 10시 사이)
            open_hour = random.randint(7, 10) # 07시 ~ 10시 사이에 오픈
            open_minute = random.choice([0, 30])
            close_hour = random.randint(20, 23) # 20시 ~ 23시 사이에 마감
            close_minute = random.choice([0, 30])
            
            # 50% 확률로 브레이크 타임 설정
            if random.random() > 0.5: 
                break_start_hour = 13
                break_start_minute = 0
                break_end_hour = 14
                break_end_minute = 0
            
            holiday = random.choice(['매주 일요일', '매주 월요일', '연중무휴', '명절 당일 휴무', None])
        elif "매일" in hours_string:
            # 예: '매일 07:00 - 22:00'
            try:
                time_part = hours_string.split("매일 ")[1]
                start_time_str, end_time_str = time_part.split(" - ")
                open_hour, open_minute = map(int, start_time_str.split(':'))
                close_hour, close_minute = map(int, end_time_str.split(':'))
            except (IndexError, ValueError):
                pass
        elif "-" in hours_string and ":" in hours_string:
            # 예: '10:00-23:00' (매일이라는 접두사 없이)
            try:
                start_time_str, end_time_str = hours_string.split("-")
                open_hour, open_minute = map(int, start_time_str.split(':'))
                close_hour, close_minute = map(int, end_time_str.split(':'))
            except (IndexError, ValueError):
                pass

        return {
            'open_hour': open_hour,
            'open_minute': open_minute,
            'close_hour': close_hour,
            'close_minute': close_minute,
            'break_start_hour': break_start_hour,
            'break_start_minute': break_start_minute,
            'break_end_hour': break_end_hour,
            'break_end_minute': break_end_minute,
            'holiday': holiday
        }

    def insert_restaurant(self, cursor, restaurant_info):
        """
        음식점 정보를 데이터베이스에 삽입합니다.
        :param cursor: DB 커서 객체
        :param restaurant_info: 삽입할 음식점 정보 딕셔너리
        """
        # 주소 파싱
        parsed_address = self._parse_address(restaurant_info.get('restaurantAddress', ''))
        
        # 영업 시간 파싱
        parsed_hours = self._parse_operating_hours(restaurant_info.get('restaurantOpenHours', ''))

        # PARKING_INFO에 랜덤 값 적용
        parking_info_value = random.choice(['가능', '불가능', '유료 주차', '인근 주차장 이용', None])

        sql = """
        INSERT INTO TB_RESTAURANT (
            RESTAURANT_ID,
            RESTAURANT_NAME,
            ADDR_SIDO,
            ADDR_SIGUNGU,
            ADDR_DONG,
            ADDR_DETAIL,
            PHONE_NUMBER,
            RESTAURANT_CATEGORY,
            RESTAURANT_LAT,
            RESTAURANT_LON,
            OPEN_HOUR,
            OPEN_MINUTE,
            CLOSE_HOUR,
            CLOSE_MINUTE,
            BREAK_START_HOUR,
            BREAK_START_MINUTE,
            BREAK_END_HOUR,
            BREAK_END_MINUTE,
            RESTAURANT_HOLIDAY,
            PARKING_INFO,
            CREATED_DATE,
            CREATED_ID,
            UPDATED_DATE,
            UPDATED_ID
        ) VALUES (
            SEQ_TB_RESTAURANT.NEXTVAL,
            :restaurantName,
            :addrSido,
            :addrSigungu,
            :addrDong,
            :addrDetail,
            :phoneNumber,
            :restaurantCategory,
            :restaurantLat,
            :restaurantLon,
            :openHour,
            :openMinute,
            :closeHour,
            :closeMinute,
            :breakStartHour,
            :breakStartMinute,
            :breakEndHour,
            :breakEndMinute,
            :restaurantHoliday,
            :parkingInfo,
            :createdDate,
            :createdId,
            :updatedDate,
            :updatedId
        )
        """
        try:
            cursor.execute(sql, {
                'restaurantName': restaurant_info.get('restaurantName'),
                'addrSido': parsed_address['sido'],
                'addrSigungu': parsed_address['sigungu'],
                'addrDong': parsed_address['dong'],
                'addrDetail': parsed_address['detail'],
                'phoneNumber': restaurant_info.get('restaurantPhoneNumber', None), # phone number는 랜덤값 생성 제외
                'restaurantCategory': restaurant_info.get('restaurantCategory', None),
                'restaurantLat': restaurant_info.get('restaurantLatitude', None),
                'restaurantLon': restaurant_info.get('restaurantLongitude', None),
                'openHour': parsed_hours['open_hour'],
                'openMinute': parsed_hours['open_minute'],
                'closeHour': parsed_hours['close_hour'],
                'closeMinute': parsed_hours['close_minute'],
                'breakStartHour': parsed_hours['break_start_hour'],
                'breakStartMinute': parsed_hours['break_start_minute'],
                'breakEndHour': parsed_hours['break_end_hour'],
                'breakEndMinute': parsed_hours['break_end_minute'],
                'restaurantHoliday': parsed_hours['holiday'],
                'parkingInfo': parking_info_value,
                'createdDate': datetime.now(),
                'createdId': "system_crawler_7road",
                'updatedDate': datetime.now(),
                'updatedId': "system_crawler_7road"
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

    def get_operating_hours(self, place_name, address):
        """
        (가상의 함수) 외부 API 또는 웹 스크래핑을 통해 특정 장소의 영업 시간을 가져옵니다.
        현재는 예시 데이터를 반환합니다. 실제 운영 시에는 이 부분을 구현해야 합니다.
        """
        if "스타벅스" in place_name:
            return "매일 07:00 - 22:00"
        elif "롯데리아" in place_name:
            return "매일 10:00 - 23:00"
        else:
            return "정보 없음" # 또는 None

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
                        try:
                            response = requests.get(self.base_url, headers=self.headers, params=params)
                            response.raise_for_status()
                            data = response.json()

                            if not data.get('documents'):
                                is_end = True
                                continue

                            for doc in data['documents']:
                                # 전화번호는 랜덤값 생성 제외. API에서 제공되는 값이 없으면 None으로 유지.
                                phone_number = doc.get('phone')

                                operating_hours = self.get_operating_hours(doc.get('place_name'), doc.get('road_address_name') or doc.get('address_name'))

                                restaurant_info = {
                                    "restaurantName": doc.get('place_name'),
                                    "restaurantAddress": doc.get('road_address_name') or doc.get('address_name'),
                                    "restaurantPhoneNumber": phone_number, # 여기에 API에서 가져온 값 그대로 사용
                                    "restaurantCategory": doc.get('category_name'),
                                    "restaurantLatitude": float(doc.get('y')),
                                    "restaurantLongitude": float(doc.get('x')),
                                    "restaurantOpenHours": operating_hours # 영업 시간은 _parse_operating_hours에서 랜덤 처리
                                }

                                # DB에 이미 존재하는지 확인 후 삽입
                                if not self.restaurant_exists(cursor, restaurant_info['restaurantName'], restaurant_info['restaurantAddress']):
                                    if self.insert_restaurant(cursor, restaurant_info):
                                        newly_saved_count += 1
                                        print(f"  새로운 맛집 저장: {restaurant_info['restaurantName']} - {restaurant_info['restaurantAddress']} (영업 시간: {restaurant_info['restaurantOpenHours']})")
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
            crawler.close_db() # DB 연결 종료