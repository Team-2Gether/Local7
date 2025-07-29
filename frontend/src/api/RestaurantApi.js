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
    const response = await apiClient.get('/restaurants/all', {
      // 캐시를 무시하도록 no-cache 헤더 추가 (이전 답변에서 제안된 내용)
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (response.data?.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      console.error('API 응답 형식이 예상과 다릅니다.', response.data);
      throw new Error('API 응답 형식 오류');
    }
  } catch (error) {
    console.error('음식점 데이터 가져오기 오류:', error);
    throw new Error('음식점 데이터를 가져오는 데 실패했습니다.');
  }
};

export const reportReview = async (reviewId, reportReason, reviewContent, targetNickname, targetUserId) => {
    try {
        // 백엔드에 전송할 데이터에 필요한 정보들을 모두 포함시킵니다.
        const requestBody = {
            reportReason,
            reviewContent,
            targetNickname,
            targetUserId,
        };

        const response = await apiClient.post(`/reviews/${reviewId}/report`, requestBody);

        if (response.data?.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.data?.message || '리뷰 신고에 실패했습니다.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '리뷰 신고 중 오류가 발생했습니다.';
        console.error('리뷰 신고 오류:', error);
        throw new Error(errorMessage);
    }
};

export default apiClient;
