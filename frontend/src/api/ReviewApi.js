import apiClient from './RestaurantApi'; 

/**
 * 특정 음식점의 리뷰 목록을 가져오는 API 함수
 * @param {number} restaurantId - 음식점 ID
 * @returns {Promise<Array>} 리뷰 데이터 배열
 */
export const fetchReviewsByRestaurantId = async (restaurantId) => {
    try {
        const response = await apiClient.get(`/reviews/restaurant/${restaurantId}`);
        if (response.data?.status === 'success' && response.data.data) {
            return response.data.data;
        } else {
            console.error('API 응답 형식이 예상과 다릅니다.', response.data);
            throw new Error('리뷰 목록 가져오기 오류');
        }
    } catch (error) {
        console.error('리뷰 데이터 가져오기 오류:', error);
        throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
    }
};

/**
 * 특정 리뷰를 삭제하는 API 함수
 * @param {number} reviewId - 삭제할 리뷰 ID
 * @returns {Promise<Object>} API 응답 데이터
 */
export const deleteReview = async (reviewId) => {
    try {
        const response = await apiClient.delete(`/reviews/${reviewId}`);
        if (response.data?.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.data?.message || '리뷰 삭제에 실패했습니다.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '리뷰 삭제 중 오류가 발생했습니다.';
        console.error('리뷰 삭제 오류:', error);
        throw new Error(errorMessage);
    }
};


