import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaExclamationTriangle  } from 'react-icons/fa';
import usePost from '../hooks/usePost';
import useLike from '../hooks/useLike';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';

import './Post.css';

function PostDetail({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { post, loading, error, loadPostById, removePost, setMessage, setPost, reportPost  } = usePost();
    const { toggleLike, likeLoading, likeError, setLikeError } = useLike();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadPostById(parseInt(id));
        }
    }, [id, loadPostById]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(parseInt(id));
                alert('게시글이 성공적으로 삭제되었습니다.');
                navigate('/', { state: { from: 'posts' } });
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                setMessage('게시글 삭제에 실패했습니다.');
            }
        }
    };

    const handleToggleLike = async () => {
        if (!currentUser) {
            alert('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }

        try {
            const result = await toggleLike(post.postId);
            setPost(prevPost => ({
                ...prevPost,
                liked: result.liked,
                likeCount: result.likeCount
            }));
            setMessage(result.message);
        } catch (err) {
            console.error('좋아요 처리 오류:', err);
            setLikeError(err.message);
        }
    };

    const handleCommentCountChange = useCallback((newCommentCount) => {
        setPost(prevPost => ({
            ...prevPost,
            commentCount: newCommentCount
        }));
    }, [setPost]);

    // 게시글 신고 모달 열기
    const handleOpenReportModal = () => {
        if (!currentUser) {
            alert('로그인 후 신고할 수 있습니다.');
            return;
        }
        setIsReportModalOpen(true);
    };

    // 신고 제출
    const handlePostReport = async (reportReason) => {
        if (!post) return;
        try {
            const response = await reportPost(post.postId, reportReason);
            alert(response.message); // 신고 성공 알림
            setIsReportModalOpen(false); 
            loadPostById(post.postId); // 게시글 정보 새로고침
        } catch (err) {
            alert("이미 신고를 하셨습니다.");
            loadPostById(post.postId);
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

    console.log('Post images:', post.images);

    const isPostAuthor = currentUser && post && currentUser.userId === post.userId;
    const showReportButton = currentUser && post && !isPostAuthor;

    return (
        <div className="post-detail-page">
            <div className="post-detail-content-area">
                <div className="post-detail-container">
                    {likeError && <div className="error-message">{likeError}</div>}

                    <h2 className="post-detail-title">{post.postTitle}</h2>
                    <p className="post-detail-meta">
                        작성자:
                        <Link to={`/user/profile/${post.userLoginId}`} className="author-link">
                            {post.userNickname || '알 수 없음'}
                        </Link>
                        | 작성일: {new Date(post.createdDate).toLocaleString()}
                        <span className="post-detail-comment-count"> | 댓글: {post.commentCount}</span>
                    </p>

                    {post.images && post.images.length > 0 && (
                        <div className="post-detail-images">
                            {post.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`data:image/jpeg;base64,${image.imageUrl}`}
                                    alt={`게시글 이미지 ${index + 1}`}
                                    className="post-detail-image"
                                />
                            ))}
                        </div>
                    )}
                    {(!post.images || post.images.length === 0) && post.firstImageUrl && (
                        <div className="post-detail-images">
                            <img
                                src={`data:image/jpeg;base64,${post.firstImageUrl}`}
                                alt="게시글 대표 이미지"
                                className="post-detail-image"
                            />
                        </div>
                    )}

                    <div className="post-detail-content">
                        <p>{post.postContent}</p>
                    </div>

                    {post.locationTag && <p className="post-detail-location-tag">위치 태그: {post.locationTag}</p>}

                    <div className="post-detail-likes">
                        <button
                            className={`like-button5 ${post.liked ? 'liked' : ''}`}
                            onClick={handleToggleLike}
                            disabled={likeLoading}
                        >
                            <span role="img" aria-label="heart">{post.liked ? '❤️' : '🤍'}</span>
                        </button>
                        <span className="like-count">❤️{post.likeCount || 0}</span>
                        <span className="post-detail-comment-count"> | 댓글: {post.commentCount}</span>
                        {showReportButton && (
                            <button
                                onClick={handleOpenReportModal}
                                className="post-detail-button report"
                                title="게시글 신고"
                            >
                                <FaExclamationTriangle />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/', { state: { from: 'posts' } })}
                        className="post-detail-button back"
                    >
                        목록으로
                    </button>

                    {currentUser && (currentUser.userId === post.userId || currentUser.userLoginId === 'admin') && (
                        <div className="post-detail-actions">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('수정하시겠습니까?')) {
                                        navigate(`/posts/edit/${post.postId}`);
                                    }
                                }}
                                className="post-detail-button edit"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('삭제하시겠습니까?')) {
                                        handleDelete(post.postId);
                                    }
                                }}
                                className="post-detail-button delete"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    )}
                    
                    {/* CommentSection 컴포넌트 추가 */}
                    <CommentSection 
                        postId={post.postId} 
                        currentUser={currentUser} 
                        onCommentCountChange={handleCommentCountChange}
                        post={post}
                    />

                    <ReportModal
                        isOpen={isReportModalOpen}
                        onClose={() => setIsReportModalOpen(false)}
                        onReport={handlePostReport}
                        target="게시글"
                    />
                </div>
            </div>
        </div>
    );
}

export default PostDetail;