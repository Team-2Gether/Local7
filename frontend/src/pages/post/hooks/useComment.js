import { useState, useCallback } from 'react';
import { fetchComments, createComment, updateComment, deleteComment } from '../../../api/CommentApi';

const useComment = () => {
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [message, setMessage] = useState(null); // 성공 메시지 추가

    const loadComments = useCallback(async (postId) => {
        setCommentsLoading(true);
        setCommentError(null);
        try {
            const data = await fetchComments(postId);
            setComments(data);
            return data; // 댓글 데이터 반환
        } catch (err) {
            setCommentError('댓글을 불러오는 데 실패했습니다.');
            console.error('Failed to load comments:', err);
            throw err; // 에러를 호출자에게 다시 던져서 처리할 수 있도록 함
        } finally {
            setCommentsLoading(false);
        }
    }, []);

    const addComment = useCallback(async (postId, content) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await createComment(postId, content);
            setMessage(response); // 성공 메시지 설정
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '댓글 작성 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to create comment:', err);
            throw new Error(errorMsg); // 에러 메시지를 포함하여 던지기
        }
    }, []);

    const modifyComment = useCallback(async (postId, commentId, content) => {
        setCommentError(null);
        setMessage(null);
        try {
            const response = await updateComment(postId, commentId, content);
            setMessage(response); // 성공 메시지 설정
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
            setMessage(response); // 성공 메시지 설정
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '댓글 삭제 중 오류가 발생했습니다.';
            setCommentError(errorMsg);
            console.error('Failed to delete comment:', err);
            throw new Error(errorMsg);
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
    };
};

export default useComment;