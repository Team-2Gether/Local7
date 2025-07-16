import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import usePost from '../hooks/usePost';
import useLike from '../hooks/useLike';
import CommentSection from './CommentSection';

import './Post.css';

function PostDetail({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { post, loading, error, loadPostById, removePost, setMessage, setPost } = usePost();
    const { toggleLike, likeLoading, likeError, setLikeError } = useLike();

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
                navigate('/posts');
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

    return (
        <div className="post-detail-page">
            <div className="post-detail-content-area">
                <div className="post-detail-container">
                    {likeError && <div className="error-message">{likeError}</div>}

                    <h2 className="post-detail-title">{post.postTitle}</h2>
                    <p className="post-detail-meta">
                        작성자:
                        <Link to={`/user/profile/${post.userLoginId}`} className="author-link">
                            {/* 이 부분을 수정했습니다. currentUser가 null일 경우 안전하게 접근합니다. */}
                            {currentUser?.userNickname || '알 수 없음'}
                        </Link>
                        | 작성일: {new Date(post.createdDate).toLocaleString()}
                        <span className="post-detail-comment-count"> | 댓글: {post.commentCount}</span>
                    </p>

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

                    <div className="post-detail-likes">
                        <button
                            className={`like-button ${post.liked ? 'liked' : ''}`}
                            onClick={handleToggleLike}
                            disabled={likeLoading}
                        >
                            <span role="img" aria-label="heart">{post.liked ? '❤️' : '🤍'}</span>
                        </button>
                        <span className="like-count">❤️{post.likeCount || 0}</span>
                        <span className="post-detail-comment-count"> | 댓글: {post.commentCount}</span>
                    </div>

                    {currentUser && post.userId === currentUser.userId && (
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
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/posts')}
                        className="post-detail-button back"
                    >
                        목록으로 돌아가기
                    </button>
                    {/* CommentSection 컴포넌트 추가 */}
                    <CommentSection postId={post.postId} currentUser={currentUser} onCommentCountChange={handleCommentCountChange}/>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;