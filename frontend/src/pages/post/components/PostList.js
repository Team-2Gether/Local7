import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePost';

import '../../../assets/css/post.css';

function PostList() {
    const { posts, loading, error, message, loadAllPosts, removePost, setMessage } = usePosts();
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 게시글 로드
    useEffect(() => {
        loadAllPosts();
    }, [loadAllPosts]);

    // 게시글 삭제 핸들러
    const handleDelete = async (postId) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(postId);
                loadAllPosts(); // 삭제 후 목록 새로고침
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
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


    return (
        <div className="post-list-page">
            <div className="post-list-content-area">
                <div className="post-list-header">
                    <h2>게시글 목록</h2>
                    <button onClick={() => navigate('/posts/new')} className="create-post-button">
                        새 게시글 작성
                    </button>
                </div>

                {loading && <p>게시글을 불러오는 중...</p>}
                {error && <p className="error-message">오류: {error}</p>}
                {message && <p className="success-message">{message}</p>}

                {!loading && !error && posts.length === 0 && <p>게시글이 없습니다.</p>}

                {!loading && !error && posts.length > 0 && (
                    <ul className="post-list">
                        {posts.map(post => (
                            <li key={post.postId} className="post-list-item">
                                <h3 className="post-title">{post.postTitle}</h3>
                                <p className="post-meta">
                                    작성자: {post.userName} | 작성일: {new Date(post.createdDate).toLocaleString()}
                                </p>
                                <p className="post-content-preview">
                                    {post.postContent.substring(0, 100)}{post.postContent.length > 100 ? '...' : ''}
                                </p>
                                <p className="location-tag">위치 태그: {post.locationTag}</p>
                                <div className="post-list-item-actions">
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