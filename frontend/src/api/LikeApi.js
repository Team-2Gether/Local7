import axios from 'axios';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, 
});

/**
 * 게시물의 좋아요 상태를 토글
 * @param {number} postId - 좋아요를 토글할 게시물의 ID
 * @returns {Promise<object>} - 서버 응답 데이터 (좋아요 상태, 좋아요 개수 등 포함)
 */
export const togglePostLike = async (postId) => {
  try {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data; 
  } catch (error) {
    console.error(`Error toggling like for post ${postId}:`, error);
    throw error; 
  }
};
