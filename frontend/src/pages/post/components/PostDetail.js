import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePost from '../hooks/usePost';
import { fetchComments, createComment, updateComment, deleteComment } from '../../../api/CommentApi'; // comments API import
import '../../../assets/css/post.css'; 
import '../../../assets/css/PostDetail.css'; 
import './CommentSection.css';

function PostDetail({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { post, loading, error, loadPostById, removePost, setMessage } = usePost();

    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [commentError, setCommentError] = useState(null); 
    const [commentsLoading, setCommentsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadPostById(parseInt(id));
            loadComments(parseInt(id));
        }
    }, [id, loadPostById]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(parseInt(id));
                alert('게시글이 성공적으로 삭제되었습니다.');
                navigate('/posts'); // 삭제 후 게시글 목록으로 이동
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                setMessage('게시글 삭제에 실패했습니다.');
            }
        }
    };

    // 댓글 목록
    const loadComments = async (postId) => {
        setCommentsLoading(true);
        setCommentError(null);
        try {
            const data = await fetchComments(postId);
            setComments(data);
        } catch (err) {
            setCommentError('댓글을 불러오는 데 실패했습니다.');
            console.error('Failed to load comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    };

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
            const message = await createComment(parseInt(id), newCommentContent);
            alert(message); // 서버에서 반환한 성공 메시지 표시
            setNewCommentContent('');
            loadComments(parseInt(id)); // 댓글 목록 새로고침
        } catch (err) {
            setCommentError(err.message || '댓글 작성 중 오류가 발생했습니다.');
        }
    };

    // 댓글 수정 
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
        if (!currentUser) { // 이중 확인 (UI에서 이미 막았지만, 혹시 모를 상황 대비)
            setCommentError('로그인 후 댓글을 수정할 수 있습니다.');
            return;
        }
        if (!editingContent.trim()) {
            setCommentError('수정할 내용을 입력해주세요.');
            return;
        }
        setCommentError(null);
        try {
            const message = await updateComment(parseInt(id), commentId, editingContent);
            alert(message); // 서버에서 반환한 성공 메시지 표시
            setEditingCommentId(null);
            setEditingContent('');
            loadComments(parseInt(id)); // 댓글 목록 새로고침
        } catch (err) {
            setCommentError(err.message || '댓글 수정 중 오류가 발생했습니다.');
        }
    };

    // 댓글 삭제 
    const handleDeleteComment = async (commentId) => {
        if (!currentUser) { // 이중 확인
            setCommentError('로그인 후 댓글을 삭제할 수 있습니다.');
            return;
        }
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            setCommentError(null);
            try {
                const message = await deleteComment(parseInt(id), commentId);
                alert(message); // 서버에서 반환한 성공 메시지 표시
                loadComments(parseInt(id)); // 댓글 목록 새로고침
            } catch (err) {
                setCommentError(err.message || '댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) {
        return <div className="post-detail-container loading">게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="post-detail-container error-message">오류: {error}</div>;
    }

    if (!post) {
        return <div className="post-detail-container no-post">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="post-detail-page">
            <div className="post-detail-content-area">
                <div className="post-detail-container">
                    <h2 className="post-detail-title">{post.postTitle}</h2>
                    <p className="post-detail-meta">
                        작성자: {post.userNickname || '알 수 없음'} | 작성일: {new Date(post.createdDate).toLocaleString()}
                    </p> 

                    {/* post.images 배열이 있을 경우 (여러 이미지) */}
                    {post.images && post.images.length > 0 && (
                        <div className="post-detail-images">
                            {post.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${image.imageUrl}`}
                                    alt={`게시글 이미지 ${index + 1}`}
                                    className="post-detail-image"
                                />
                            ))}
                        </div>
                    )}
                    {/* firstImageUrl만 있는 경우 (images 배열이 비어있거나 없는 경우) */}
                    {(!post.images || post.images.length === 0) && post.firstImageUrl && (
                        <div className="post-detail-images">
                            <img
                                src={`http://localhost:8080${post.firstImageUrl}`}
                                alt="게시글 대표 이미지"
                                className="post-detail-image"
                            />
                        </div>
                    )}

                    <div className="post-detail-content">
                        <p>{post.postContent}</p>
                    </div>
                    
                    {post.locationTag && <p className="post-detail-location-tag">위치 태그: {post.locationTag}</p>}
                    <div className="post-detail-actions">
                        <button
                            onClick={() => navigate(`/posts/edit/${post.postId}`)}
                            className="post-detail-button edit"
                        >
                            수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="post-detail-button delete"
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => navigate('/posts')}
                            className="post-detail-button back"
                        >
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>

                <div className="comment-section">
                    <h3>댓글</h3>
                    {commentError && <p className="error-message">{commentError}</p>}

                    {/* 댓글 작성 폼 */}
                    {currentUser ? ( // 로그인된 사용자에게만 댓글 작성 폼 표시
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
            </div>
        </div>
    );
}

export default PostDetail;