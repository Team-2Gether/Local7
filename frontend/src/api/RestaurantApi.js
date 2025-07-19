import axios from 'axios';

// withCredentials를 true로 설정하여 쿠키와 인증 헤더를 포함
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, 
});

/**
 * 모든 음식점 목록을 비동기로 가져오는 API 함수
 * @returns {Promise<Array>} 음식점 데이터 배열
 */
export const fetchAllRestaurants = async () => {
  try {
    // apiClient 인스턴스를 사용하여 /restaurants/all 엔드포인트에 GET 요청을 보냅니다.
    const response = await apiClient.get('/restaurants/all');
    
    if (response.data?.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      console.error('API 응답 형식이 예상과 다릅니다.', response.data);
      throw new Error('API 응답 형식 오류');
    }
  } catch (error) { // 에러 변수명을 err에서 error로 통일
    console.error('음식점 데이터 가져오기 오류:', error);
    throw new Error('음식점 데이터를 가져오는 데 실패했습니다.');
  }
};