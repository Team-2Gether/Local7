import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePost from '../hooks/usePost';
import useLike from '../hooks/useLike';

import './PostList.css'; 

function PostList({ currentUser }) {

    const { posts, loading, error, message, loadAllPosts, removePost, setMessage, setPosts } = usePost();
    const { toggleLike, likeLoading, likeError, setLikeError } = useLike();
    const navigate = useNavigate();

    useEffect(() => {
        loadAllPosts();
    }, [loadAllPosts]);

    const handleDelete = async (postId) => {
        // alert 대신 커스텀 모달 UI 사용 권장
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(postId);
                loadAllPosts();
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                // alert 대신 커스텀 모달 UI 사용 권장
                alert(err.response?.data?.message || '게시글 삭제에 실패했습니다. 권한을 확인해주세요.');
            }
        }
    };

    // 좋아요 버튼 클릭 핸들러
    const handleToggleLike = async (postId, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지 (게시글 상세 페이지로 이동하는 것을 막음)

        if (!currentUser) {
            // alert 대신 커스텀 모달 UI 사용 권장
            alert('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }

        try {
            const result = await toggleLike(postId); // 좋아요 토글 API 호출
            // posts 상태 업데이트
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId
                        ? { ...post, liked: result.liked, likeCount: result.likeCount }
                        : post
                )
            );
            setMessage(result.message); // 좋아요 성공/취소 메시지 표시
        } catch (err) {
            console.error('좋아요 처리 오류:', err);
            // alert 대신 커스텀 모달 UI 사용 권장
            alert(err.message); // 에러 메시지 표시
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

     const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`); // postId를 포함한 URL로 이동
    };

    if (loading) return <div className="loading-message">게시글 로딩 중...</div>;
    if (error) return <div className="error-message">오류: {error}</div>;

    return (
        <div className="post-list-container">
            <h1 className="post-list-title">쓰레드 목록</h1>

            {message && <div className="success-message">{message}</div>}
            {likeError && <div className="error-message">{likeError}</div>}

            <div className="post-actions-top">
                <button
                    onClick={() => navigate('/posts/new')}
                    className="post-button create-button"
                >
                    새 게시글 작성
                </button>
            </div>
            <div className="post-grid-wrapper">
                {posts.length === 0 ? (
                    <p className="no-posts-message">게시글이 없습니다.</p>
                ) : (
                    <ul className="post-grid">
                        {posts.map((post) => {
                        return (

                            <li key={post.postId} className="post-card">
                                {/* 게시글 상세 페이지로 이동 링크 */}
                                <div onClick={() => handlePostClick(post.postId)} style={{ cursor: 'pointer' }}>
                                    {/* 이미지 미리보기 추가 */}
                                    {post.firstImageUrl && (
                                        <div className="post-thumbnail">
                                            <img
                                                src={`http://localhost:8080${post.firstImageUrl}`}
                                                alt="게시글 미리보기"
                                                className="thumbnail-image"
                                            />
                                        </div>
                                    )}
                                    {/* 이미지가 없는 경우를 위한 플레이스홀더 (선택 사항) */}
                                    {!post.firstImageUrl && (
                                        <div className="post-thumbnail-placeholder">
                                            <p>이미지 없음</p>
                                        </div>
                                    )}

                                    <h2 className="post-card-title">{post.postTitle}</h2>
                                    <p className="post-card-content">{post.postContent}</p>
                                    <p className="post-card-meta">작성자: {post.userNickname}</p>
                                    <p className="post-card-meta">작성일: {new Date(post.createdDate).toLocaleDateString()}</p>
                                    <p className="post-card-likes">
                                        <span
                                            className={`like-button ${post.liked ? 'liked' : ''}`}
                                            onClick={(e) => handleToggleLike(post.postId, e)} // 좋아요 버튼 클릭 이벤트
                                            disabled={likeLoading}
                                        >
                                            {post.liked ? '❤️' : '🤍'}
                                        </span>
                                        <span className="like-count">❤️{post.likeCount || 0}</span>
                                        <span className="comment-count">💬 {post.commentCount}</span>
                                    </p>

                                    <p className="post-card-meta">위치: {post.locationTag}</p>
                                </div>

                                <div className="post-card-actions">
                                {currentUser && (currentUser.userId === post.userId || currentUser.userLoginId === 'admin') && (

                                    <>
                                    <button
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/posts/edit/${post.postId}`);
                                        }}
                                        className="post-action-button edit"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(post.postId);
                                        }}
                                        className="post-action-button delete"
                                    >
                                        삭제
                                    </button>
                                    </>
                                )}
                                </div>
                            </li>
                        );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PostList;
