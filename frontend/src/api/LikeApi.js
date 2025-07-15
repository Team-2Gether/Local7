import axios from 'axios';

// 좋아요 토글 
export const togglePostLike = async (postId) => {
    try {
        // 좋아요 API 엔드포인트는 /api/posts/{postId}/like
        const response = await axios.post(`http://localhost:8080/api/posts/${postId}/like`);
        return response.data; // 서버 응답 (좋아요 상태, 좋아요 개수 포함)
    } catch (error) {
        console.error(`Error toggling like for post ${postId}:`, error);
        throw error;
    }
};