import { useState, useCallback } from 'react';
import { togglePostLike } from '../../../api/LikeApi';

const useLike = () => {
    const [likeLoading, setLikeLoading] = useState(false);
    const [likeError, setLikeError] = useState(null);

    // 게시글 좋아요 상태 토글 함수
    const toggleLike = useCallback(async (postId) => {
        setLikeLoading(true);
        setLikeError(null);
        try {
            const response = await togglePostLike(postId);
            // 성공 시 서버에서 반환된 최신 좋아요 상태와 개수를 반환
            return {
                liked: response.liked,
                likeCount: response.likeCount,
                message: response.message
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다.';
            setLikeError(errorMessage);
            console.error('Failed to toggle like:', err);
            throw new Error(errorMessage);
        } finally {
            setLikeLoading(false);
        }
    }, []);

    return {
        likeLoading,
        likeError,
        toggleLike,
        setLikeError 
    };
};

export default useLike;