import { useState, useEffect, useCallback } from 'react';
import { fetchComments, createComment, updateComment, deleteComment } from '../../../api/CommentApi';

const useComment = (postId) => {
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // 댓글 목록 불러오기
    const loadComments = useCallback(async (currentPostId) => {
        setCommentsLoading(true);
        setCommentError(null);
        try {
            const data = await fetchComments(currentPostId);
            setComments(data);
        } catch (err) {
            console.error('댓글 로딩 실패:', err);
            setCommentError('댓글을 불러오는 데 실패했습니다.');
        } finally {
            setCommentsLoading(false);
        }
    }, []);

    // postId가 변경될 때마다 댓글 로드
    useEffect(() => {
        if (postId) {
            loadComments(postId);
        }
    }, [postId, loadComments]);

    // 댓글 작성 핸들러
    const handleCreateComment = useCallback(async (e, currentUserId) => {
        e.preventDefault();
        setCommentError(null);

        if (!newCommentContent.trim()) {
            setCommentError('댓글 내용을 입력해주세요.');
            return;
        }
        if (!currentUserId) {
            setCommentError('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }

        try {
            await createComment({
                postId: postId,
                userId: currentUserId, // 백엔드에서 세션으로 userId를 가져오면 필요 없을 수도 있습니다.
                content: newCommentContent,
            });
            setNewCommentContent('');
            loadComments(postId); // 댓글 목록 새로고침
        } catch (err) {
            console.error('댓글 작성 실패:', err);
            setCommentError(err.response?.data || '댓글 작성에 실패했습니다.');
        }
    }, [newCommentContent, postId, loadComments]);

    // 댓글 수정 클릭 핸들러
    const handleUpdateCommentClick = useCallback((comment) => {
        setEditingCommentId(comment.commentId);
        setEditingContent(comment.content);
    }, []);

    // 댓글 수정 저장 핸들러
    const handleSaveEditComment = useCallback(async (commentId) => {
        setCommentError(null);
        if (!editingContent.trim()) {
            setCommentError('수정할 내용을 입력해주세요.');
            return;
        }

        try {
            await updateComment(commentId, { content: editingContent });
            setEditingCommentId(null);
            setEditingContent('');
            loadComments(postId); // 댓글 목록 새로고침
        } catch (err) {
            console.error('댓글 수정 실패:', err);
            setCommentError(err.response?.data || '댓글 수정에 실패했습니다.');
        }
    }, [editingContent, postId, loadComments]);

    // 댓글 수정 취소 핸들러
    const handleCancelEditComment = useCallback(() => {
        setEditingCommentId(null);
        setEditingContent('');
        setCommentError(null);
    }, []);

    // 댓글 삭제 핸들러
    const handleDeleteComment = useCallback(async (commentId) => {
        if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            return;
        }
        setCommentError(null);
        try {
            await deleteComment(commentId);
            loadComments(postId); // 댓글 목록 새로고침
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
            setCommentError(err.response?.data || '댓글 삭제에 실패했습니다.');
        }
    }, [postId, loadComments]);

    return {
        comments,
        newCommentContent,
        setNewCommentContent,
        editingCommentId,
        editingContent,
        setEditingContent,
        commentError,
        commentsLoading,
        handleCreateComment,
        handleUpdateCommentClick,
        handleSaveEditComment,
        handleCancelEditComment,
        handleDeleteComment,
    };
};

export default useComment;