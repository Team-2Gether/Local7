import React, { useState, useEffect, useCallback } from 'react';
import useComment from '../hooks/useComment';
import './CommentSection.css';

function CommentSection({ postId, currentUser, onCommentCountChange }) {
    const {
        comments,
        commentsLoading,
        commentError,
        message, 
        setCommentError, 
        setMessage, 
        loadComments,
        addComment,
        modifyComment,
        removeComment,
        toggleCommentLike,
    } = useComment();

    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');

    useEffect(() => {
        if (postId) {
            loadComments(postId, sortOrder); 
        }
    }, [postId, loadComments, sortOrder]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    // 댓글 목록이 변경될 때마다 부모 컴포넌트에 댓글 수 전달
    useEffect(() => {
        if (onCommentCountChange) {
            onCommentCountChange(comments.length);
        }
    }, [comments, onCommentCountChange]);

    // 댓글 작성
    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setCommentError('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
        if (!newCommentContent.trim()) {
            setCommentError('댓글 내용을 입력해주세요.');
            return;
        }
        setCommentError(null);
        try {
            await addComment(postId, newCommentContent);
            setNewCommentContent('');
            await loadComments(postId, sortOrder); // 댓글 목록 새로고침 (댓글 수 자동 업데이트)
            setMessage('댓글이 성공적으로 작성되었습니다.'); // 성공 메시지 추가
        } catch (err) {
            console.error("댓글 작성 오류:", err);
            setCommentError('댓글 작성에 실패했습니다.');
        }
    };

    // 댓글 수정 클릭
    const handleUpdateCommentClick = (comment) => {
        if (!currentUser) {
            setCommentError('로그인 후 댓글을 수정할 수 있습니다.');
            return;
        }
        // 이 부분의 조건을 수정했습니다: 관리자(admin)이거나 본인 댓글인 경우
        if (currentUser.userId !== comment.userId && currentUser.userLoginId !== 'admin') {
            setCommentError('댓글을 수정할 권한이 없습니다.');
            return;
        }
        setEditingCommentId(comment.commentId);
        setEditingContent(comment.content);
    };

    // 댓글 수정 취소
    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    // 댓글 수정 저장
    const handleSaveEditComment = async (commentId) => {
        if (!currentUser) {
            setCommentError('로그인 후 댓글을 수정할 수 있습니다.');
            return;
        }
        
        // 수정할 댓글의 정보를 comments 배열에서 찾아서 권한 다시 확인
        const commentToEdit = comments.find(c => c.commentId === commentId);
        if (!commentToEdit || (currentUser.userId !== commentToEdit.userId && currentUser.userLoginId !== 'admin')) {
            setCommentError('댓글을 수정할 권한이 없습니다.');
            return;
        }

        if (!editingContent.trim()) {
            setCommentError('수정할 내용을 입력해주세요.');
            return;
        }
        setCommentError(null);
        try {
            await modifyComment(postId, commentId, editingContent);
            setEditingCommentId(null);
            setEditingContent('');
            await loadComments(postId, sortOrder); // 댓글 목록 새로고침 (댓글 수 자동 업데이트)
            setMessage('댓글이 성공적으로 수정되었습니다.'); // 성공 메시지 추가
        } catch (err) {
            console.error("댓글 수정 오류:", err);
            setCommentError('댓글 수정에 실패했습니다.');
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        if (!currentUser) {
            setCommentError('로그인 후 댓글을 삭제할 수 있습니다.');
            return;
        }

        // 삭제할 댓글의 정보를 comments 배열에서 찾아서 권한 다시 확인
        const commentToDelete = comments.find(c => c.commentId === commentId);
        if (!commentToDelete || (currentUser.userId !== commentToDelete.userId && currentUser.userLoginId !== 'admin')) {
            setCommentError('댓글을 삭제할 권한이 없습니다.');
            return;
        }

        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            setCommentError(null);
            try {
                await removeComment(postId, commentId);
                await loadComments(postId, sortOrder); // 댓글 목록 새로고침 (댓글 수 자동 업데이트)
                setMessage('댓글이 성공적으로 삭제되었습니다.'); // 성공 메시지 추가
            } catch (err) {
                console.error("댓글 삭제 오류:", err);
                setCommentError('댓글 삭제에 실패했습니다.');
            }
        }
    };

    const handleToggleLike = async (commentId) => {
        if (!currentUser) {
            setCommentError('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }
        setCommentError(null);
        try {
            await toggleCommentLike(commentId, currentUser.userId); 
            await loadComments(postId, sortOrder); 
        } catch (error) {
            console.error('좋아요 토글 실패:', error);
            setCommentError('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    if (commentsLoading) {
        return <p>댓글을 불러오는 중...</p>;
    }

    if (commentError && !message) { // 메시지가 있으면 에러 메시지 대신 메시지를 보여줄 수 있음
        return <p className="error-message">{commentError}</p>;
    }

    return (
        <div className="comment-section1">
            <h3>댓글</h3>
            {message && <div className="success-message">{message}</div>} 
            {commentError && <p className="error-message">{commentError}</p>}

            {/* 댓글 작성 폼 */}
            {currentUser ? (
                <form onSubmit={handleCreateComment} className="comment-form">
                    <textarea
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        rows="3"
                    ></textarea>
                    <button type="submit">댓글 작성</button>
                </form>
            ) : (
                <p className="login-prompt">로그인해야 댓글을 작성할 수 있습니다.</p>
            )}

            <div className="comment-filter-options">
                <label htmlFor="sortOrder">정렬:</label>
                <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="likes">좋아요순</option>
                </select>
            </div>

            {/* 댓글 목록 */}
            <div className="comment-list">
                {commentsLoading ? (
                    <p>댓글을 불러오는 중...</p>
                ) : comments.length === 0 ? (
                    <p>등록된 댓글이 없습니다.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.commentId} className="comment-item">
                            <div className="comment-header">
                                <img
                                    src={comment.userProfImgUrl || '/images/default_profile.png'} // 기본 프로필 이미지 경로 수정 (이전에 안내드린대로)
                                    alt="프로필"
                                    className="profile-img"
                                />
                                <span className="user-nickname">{comment.userNickname}</span>
                                <span className="comment-date">
                                    {new Date(comment.createdDate).toLocaleString()}
                                </span>
                            </div>
                            {editingCommentId === comment.commentId ? (
                                <div className="editing-area">
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        rows="2"
                                    ></textarea>
                                    <button onClick={() => handleSaveEditComment(comment.commentId)}>저장</button>
                                    <button onClick={handleCancelEditComment}>취소</button>
                                </div>
                            ) : (
                                <p className="comment-content">{comment.content}</p>
                            )}

                            <div className="comment-footer">
                                <button 
                                    className={`like-button1 ${comment.likedByCurrentUser ? 'liked' : ''}`}
                                    onClick={() => handleToggleLike(comment.commentId)}
                                    disabled={!currentUser}
                                >
                                    ❤️ {comment.likeCount || 0}
                                </button>

                                {/* 수정/삭제 버튼은 현재 로그인한 사용자의 댓글에만 표시 (관리자 포함) */}
                                {currentUser && (currentUser.userId === comment.userId || currentUser.userLoginId === 'admin') && editingCommentId !== comment.commentId && (
                                    <div className="comment-actions">
                                        <button onClick={() => handleUpdateCommentClick(comment)}>수정</button>
                                        <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;