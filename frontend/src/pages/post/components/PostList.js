import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePost';

import '../../../assets/css/post.css';

// currentUser prop을 받도록 수정
function PostList({ currentUser }) {

    console.log("currentUser:", currentUser);

    const { posts, loading, error, message, loadAllPosts, removePost, setMessage } = usePosts();
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 게시글 로드
    useEffect(() => {
        loadAllPosts();
    }, [loadAllPosts]);

    // 게시글 삭제 핸들러
    const handleDelete = async (postId) => {
        // 백엔드에서 권한을 확인하므로 여기서는 단순 확인만
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(postId); // removePost는 이제 본인 게시글이 아닐 경우 에러를 반환할 수 있음
                loadAllPosts(); // 삭제 후 목록 새로고침
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                alert(err.response?.data?.message || '게시글 삭제에 실패했습니다. 권한을 확인해주세요.');
            }
        }
    };

    // 메시지 처리
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    if (loading) {
        return <div className="loading-spinner"></div>; // 로딩 스피너
    }

    if (error) {
        return <p className="error-message">{error}</p>; // 에러 메시지
    }

    return (
        <div className="post-list-page">
            <div className="post-list-content-area">
                <div className="post-list-header">
                    <h2>게시글 목록</h2>
                    {/* 로그인된 사용자만 게시글 작성 버튼 노출 */}
                    {currentUser && (
                        <button onClick={() => navigate('/posts/new')} className="create-post-button">
                            새 게시글 작성
                        </button>
                    )}
                </div>
                {message && <p className="success-message">{message}</p>}
                {posts.length === 0 ? (
                    <p className="no-posts-message">아직 작성된 게시글이 없습니다.</p>
                ) : (
                    <ul className="post-list">
                        {posts.map(post => (
                            <li key={post.postId} className="post-list-item">
                                {post.images && post.images.length > 0 && (
                                    <div className="post-images-preview">
                                        <img
                                            src={post.images[0].imageUrl}
                                            alt="게시글 대표 이미지"
                                            className="post-main-image"
                                            onClick={() => navigate(`/posts/${post.postId}`)}
                                        />
                                        {post.images.length > 1 && (
                                            <div className="post-thumbnail-gallery">
                                                {post.images.slice(1, 4).map((img, idx) => (
                                                    <img
                                                        key={img.imageId}
                                                        src={img.imageUrl}
                                                        alt={`게시글 이미지 ${idx + 2}`}
                                                        className="post-sub-image"
                                                        onClick={() => navigate(`/posts/${post.postId}`)}
                                                    />
                                                ))}
                                                {post.images.length > 4 && (
                                                    <div className="more-images-overlay" onClick={() => navigate(`/posts/${post.postId}`)}>
                                                        +{post.images.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h3 className="post-title" onClick={() => navigate(`/posts/${post.postId}`)}>
                                    {post.postTitle}
                                </h3>
                                <p className="post-meta">
                                    작성자: **{post.userNickname}** | 작성일: {new Date(post.createdDate).toLocaleString()}
                                </p>
                                <p className="post-content-preview">
                                    {post.postContent.substring(0, 100)}{post.postContent.length > 100 ? '...' : ''}
                                </p>
                                <p className="location-tag">위치 태그: {post.locationTag}</p>
                                <div className="post-list-item-actions">

                                    {console.log("현재 로그인된 사용자 ID (currentUser.userId):", currentUser?.userId, "게시글 작성자 ID (post.userId):", post.userId)}
                                    {console.log("타입 확인: currentUser.userId 타입:", typeof currentUser?.userId, "post.userId 타입:", typeof post.userId)}
                                    {console.log("비교 결과:", currentUser && currentUser.userId === post.userId)}

                                    {/* 현재 로그인된 사용자와 게시글 작성자가 동일한 경우에만 버튼 노출 */}
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