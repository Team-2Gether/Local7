// src/pages/post/components/PostList.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePost'; // usePosts 훅 임포트

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
                // 삭제 성공 메시지는 usePosts 훅에서 설정되므로, 여기서는 목록만 새로고침
                loadAllPosts(); // 삭제 후 목록 새로고침
            } catch (err) {
                // 에러 메시지는 usePosts 훅에서 설정되므로, 여기서는 추가 처리 없음
                console.error('게시글 삭제 오류:', err);
            }
        }
    };

    // 메시지 표시 후 일정 시간 뒤 사라지도록
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>게시글 목록</h2>
            {message && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{message}</p>}
            <button
                onClick={() => navigate('/posts/new')}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                새 게시글 작성
            </button>
            {posts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>게시글이 없습니다.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {posts.map((post) => (
                        <li
                            key={post.postId}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '15px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                {post.postTitle}
                                {post.isNotice === 'Y' && <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#007bff' }}>[공지]</span>}
                            </h3>
                            <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                                작성자: {post.createdId} | 작성일: {new Date(post.createdDate).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '1em', color: '#444', lineHeight: '1.5' }}>
                                {post.postContent.substring(0, 100)}{post.postContent.length > 100 ? '...' : ''}
                            </p>
                            <p style={{ fontSize: '0.9em', color: '#888' }}>위치 태그: {post.locationTag}</p>
                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <button
                                    onClick={() => navigate(`/posts/edit/${post.postId}`)}
                                    style={{
                                        padding: '8px 15px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(post.postId)}
                                    style={{
                                        padding: '8px 15px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostList;
