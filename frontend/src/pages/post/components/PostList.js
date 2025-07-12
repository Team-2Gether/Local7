import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePost';

import '../../../assets/css/post.css';

function PostList({ currentUser }) {

    console.log("currentUser:", currentUser);

    const { posts, loading, error, message, loadAllPosts, removePost, setMessage } = usePosts();
    const navigate = useNavigate();

    useEffect(() => {
        loadAllPosts();
    }, [loadAllPosts]);

    const handleDelete = async (postId) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(postId);
                loadAllPosts();
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                alert(err.response?.data?.message || '게시글 삭제에 실패했습니다. 권한을 확인해주세요.');
            }
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

    if (loading) return <div className="loading-message">게시글 로딩 중...</div>;
    if (error) return <div className="error-message">오류: {error}</div>;

    return (
        <div className="post-list-container">
            <h1 className="post-list-title">게시글 목록</h1>
            {message && <div className="success-message">{message}</div>}
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
                        {posts.map((post) => (
                            <li key={post.postId} className="post-card">
                                {/* 게시글 상세 페이지로 이동 링크 */}
                                <div onClick={() => navigate(`/posts/${post.postId}`)} style={{ cursor: 'pointer' }}>
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
                                    <p className="post-card-meta">위치: {post.locationTag}</p>
                                </div>
                                <div className="post-card-actions">
                                    {console.log("currentUser.userId 타입:", typeof currentUser?.userId, "post.userId 타입:", typeof post.userId)}
                                    {console.log("비교 결과:", currentUser && currentUser.userId === post.userId)}

                                    {currentUser && currentUser.userId === post.userId && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/posts/edit/${post.postId}`)}
                                                className="post-action-button edit"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.postId)}
                                                className="post-action-button delete"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PostList;