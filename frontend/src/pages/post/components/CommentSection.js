import React from 'react';
import useComment from '../hooks/useComment'; 
import '../components/CommentSection.css'; // CSS 파일 경로에 맞게 수정

function CommentSection({ postId, currentUser }) {
    const {
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
    } = useComment(postId); // postId를 훅에 전달

    return (
        <div className="comment-section">
            <h3>댓글</h3>
            {commentError && <p className="error-message">{commentError}</p>}

            {/* 댓글 작성 폼 */}
            {currentUser ? ( // 로그인된 사용자에게만 댓글 작성 폼 표시
                <form onSubmit={(e) => handleCreateComment(e, currentUser.userId)} className="comment-form">
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
                                    src={comment.userProfImgUrl || 'https://via.placeholder.com/30'} // 기본 이미지
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