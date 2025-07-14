import React, { useState, useEffect } from 'react';
import useComment from '../hooks/useComment';
import './CommentSection.css';

function CommentSection({ postId, currentUser }) {
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
    } = useComment();

    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    useEffect(() => {
        if (postId) {
            loadComments(postId);
        }
    }, [postId, loadComments]);

    // 메시지 3초 후 자동 사라짐
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

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
        setCommentError(null); // 이전 에러 메시지 초기화
        try {
            await addComment(postId, newCommentContent);
            setNewCommentContent('');
            loadComments(postId); // 댓글 목록 새로고침
        } catch (err) {
            console.log("err:", err);
        }
    };

    // 댓글 수정 클릭
    const handleUpdateCommentClick = (comment) => {
        if (!currentUser || currentUser.userId !== comment.userId) {
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
        if (!editingContent.trim()) {
            setCommentError('수정할 내용을 입력해주세요.');
            return;
        }
        setCommentError(null); // 이전 에러 메시지 초기화
        try {
            await modifyComment(postId, commentId, editingContent);
            setEditingCommentId(null);
            setEditingContent('');
            loadComments(postId); // 댓글 목록 새로고침
        } catch (err) {
            console.log("err:", err);
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        if (!currentUser) {
            setCommentError('로그인 후 댓글을 삭제할 수 있습니다.');
            return;
        }
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            setCommentError(null); // 이전 에러 메시지 초기화
            try {
                await removeComment(postId, commentId);
                loadComments(postId); // 댓글 목록 새로고침
            } catch (err) {
                console.log("err:", err);
            }
        }
    };

    return (
        <div className="comment-section">
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
                                    src={comment.userProfImgUrl || 'https://via.placeholder.com/30'}
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

                            {/* 수정/삭제 버튼은 현재 로그인한 사용자의 댓글에만 표시 */}
                            {currentUser && currentUser.userId === comment.userId && editingCommentId !== comment.commentId && (
                                <div className="comment-actions">
                                    <button onClick={() => handleUpdateCommentClick(comment)}>수정</button>
                                    <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;