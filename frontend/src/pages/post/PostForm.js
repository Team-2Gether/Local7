import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePosts from './hooks/usePost'; 

function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const { post, loading, error, message, loadPostById, addPost, modifyPost, setMessage, setError } = usePosts();

    const [formData, setFormData] = useState({
        postTitle: '',
        postContent: '',
        locationTag: '',
        isNotice: 'N',
        userId: 1, 
        restaurantId: 1 
    });

    // 수정 모드일 때 기존 게시글 데이터 불러오기
    useEffect(() => {
        if (isEditMode && id) {
            loadPostById(parseInt(id)); // ID를 숫자로 변환
        }
    }, [id, isEditMode, loadPostById]);

    // post 데이터가 로드되면 formData를 업데이트
    useEffect(() => {
        if (isEditMode && post) {
            setFormData({
                postTitle: post.postTitle || '',
                postContent: post.postContent || '',
                locationTag: post.locationTag || '',
                isNotice: post.isNotice || 'N',
                userId: post.userId || 1,
                restaurantId: post.restaurantId || 1
            });
        }
    }, [post, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            if (isEditMode) {
                await modifyPost(parseInt(id), formData);
            } else {
                await addPost(formData);
                setFormData({ 
                    postTitle: '',
                    postContent: '',
                    locationTag: '',
                    isNotice: 'N',
                    userId: 1,
                    restaurantId: 1
                });
            }
            navigate('/posts'); // 목록 페이지로 이동
        } catch (err) {
            console.error('게시글 저장 오류:', err);
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

    if (loading && isEditMode) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>게시글 데이터를 불러오는 중...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
                {isEditMode ? '게시글 수정' : '새 게시글 작성'}
            </h2>
            {message && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="postTitle" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목:</label>
                    <input
                        type="text"
                        id="postTitle"
                        name="postTitle"
                        value={formData.postTitle}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="postContent" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용:</label>
                    <textarea
                        id="postContent"
                        name="postContent"
                        value={formData.postContent}
                        onChange={handleChange}
                        required
                        rows="8"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="locationTag" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>위치 태그:</label>
                    <input
                        type="text"
                        id="locationTag"
                        name="locationTag"
                        value={formData.locationTag}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="checkbox"
                        id="isNotice"
                        name="isNotice"
                        checked={formData.isNotice === 'Y'}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                    />
                    <label htmlFor="isNotice" style={{ fontWeight: 'bold' }}>공지사항 여부</label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 25px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.1em',
                        width: '100%'
                    }}
                >
                    {loading ? '저장 중...' : (isEditMode ? '게시글 수정' : '게시글 작성')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/posts')}
                    style={{
                        padding: '12px 25px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.1em',
                        width: '100%',
                        marginTop: '10px'
                    }}
                >
                    목록으로 돌아가기
                </button>
            </form>
        </div>
    );
}

export default PostForm;
