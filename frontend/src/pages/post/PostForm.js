// src/pages/post/PostForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePosts from './hooks/usePost';
import '../../assets/css/post.css';

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
        userId: 1, // 실제 사용자 ID로 변경 필요
        restaurantId: 1 // 실제 음식점 ID로 변경 필요
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
    }, [isEditMode, post]);

    // 메시지 표시 후 일정 시간 뒤 사라지도록
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // 새로운 요청 전 에러 초기화

        try {
            if (isEditMode) {
                await modifyPost(parseInt(id), formData);
                alert('게시글이 성공적으로 수정되었습니다.');
            } else {
                await addPost(formData);
                alert('게시글이 성공적으로 작성되었습니다.');
            }
            navigate('/posts'); 
        } catch (err) {
            console.error('게시글 처리 실패:', err);
        }
    };

    return (
        <div className="post-form-page">
            <div className="post-form-content-area">
                <div className="post-form-container">
                    <h2>{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h2>
                    {loading && <p>처리 중...</p>}
                    {error && <p className="error-message">오류: {error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <form onSubmit={handleSubmit} className="post-form">
                        <div className="form-group">
                            <label htmlFor="postTitle" className="form-label">제목:</label>
                            <input
                                type="text"
                                id="postTitle"
                                name="postTitle"
                                value={formData.postTitle}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="postContent" className="form-label">내용:</label>
                            <textarea
                                id="postContent"
                                name="postContent"
                                value={formData.postContent}
                                onChange={handleChange}
                                required
                                className="form-textarea"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="locationTag" className="form-label">위치 태그:</label>
                            <input
                                type="text"
                                id="locationTag"
                                name="locationTag"
                                value={formData.locationTag}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="isNotice"
                                name="isNotice"
                                checked={formData.isNotice === 'Y'}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="isNotice" className="form-label">공지사항 여부</label>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="post-button post-submit-button"
                        >
                            {loading ? '저장 중...' : (isEditMode ? '게시글 수정' : '게시글 작성')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/posts')}
                            className="post-button post-back-button"
                        >
                            목록으로 돌아가기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PostForm;