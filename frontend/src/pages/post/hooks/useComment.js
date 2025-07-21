import { useState, useCallback } from 'react';
import { fetchComments, createComment, updateComment, deleteComment, toggleLikeComment, reportComment } from '../../../api/CommentApi'; 

const useComment = () => {
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [message, setMessage] = useState(null); // 성공 메시지 추가

    // loadComments 함수에 sortOrder 매개변수 추가
    const loadComments = useCallback(async (postId, sortOrder = 'latest') => { 
        setCommentsLoading(true);
        setCommentError(null);
        try {
            const data = await fetchComments(postId, sortOrder); 
            setComments(data);
            return data;
        } catch (err) {
            setCommentError('댓글을 불러오는 데 실패했습니다.');
            console.error('Failed to load comments:', err);
            throw err;
        } finally {
            setCommentsLoading(false);
        }
    }, []);

    const addComment = useCallback(async (postId, content) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await createComment(postId, content);
            setMessage(response);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '댓글 작성 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to add comment:', err);
            throw new Error(errorMsg);
        }
    }, []);

    const modifyComment = useCallback(async (postId, commentId, content) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await updateComment(postId, commentId, content);
            setMessage(response);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '댓글 수정 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to update comment:', err);
            throw new Error(errorMsg);
        }
    }, []);

    const removeComment = useCallback(async (postId, commentId) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await deleteComment(postId, commentId);
            setMessage(response);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '댓글 삭제 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to delete comment:', err);
            throw new Error(errorMsg);
        }
    }, []);

    // 댓글 좋아요 토글 함수
    const toggleCommentLike = useCallback(async (commentId, userId) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await toggleLikeComment(commentId, userId);
            setMessage(response.message);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '좋아요 처리 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to toggle comment like:', err);
            throw new Error(errorMsg);
        }
    }, []);
    
    // 신고
    const handleReportComment = useCallback(async (commentId, reportReason) => {
      setCommentError(null);
      setMessage(null);
      try {
        const response = await reportComment(commentId, reportReason);
        setMessage(response.message);
        return response; // 성공 응답 객체 반환
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || '댓글 신고 중 오류가 발생했습니다.';
        setCommentError(errorMsg);
        console.error('Failed to report comment:', err);
        throw new Error(errorMsg); // 실패 메시지를 담아 에러를 throw
      }
    }, []);

    return {
        comments,
        commentsLoading,
        commentError,
        message, 
        setComments,
        setCommentError, 
        setMessage, 
        loadComments,
        addComment,
        modifyComment,
        removeComment,
        toggleCommentLike,
        handleReportComment ,
    };
};

export default useComment;