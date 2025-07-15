import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePost from './hooks/usePost';
import './PostForm.css'; // PostForm.css 임포트 유지

// currentUser prop을 받도록 수정
function PostForm({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const { post, loading, error, message, loadPostById, addPost, modifyPost, setMessage, setError } = usePost();

    const [formData, setFormData] = useState({
        postTitle: '',
        postContent: '',
        locationTag: '',
        isNotice: 'N',
        userId: currentUser ? currentUser.userId : null, // 로그인된 사용자 ID로 초기화
        restaurantId: 1 // 실제 음식점 ID로 변경 필요
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    // 수정 모드일 때 기존 게시글 데이터 불러오기
    useEffect(() => {
        if (isEditMode && id) {
            loadPostById(parseInt(id));
        }
    }, [id, isEditMode, loadPostById]);

    // post 데이터가 로드되거나 currentUser가 변경되면 formData 및 기존 이미지 업데이트
    useEffect(() => {
        if (isEditMode && post) {
            setFormData({
                postTitle: post.postTitle || '',
                postContent: post.postContent || '',
                locationTag: post.locationTag || '',
                isNotice: post.isNotice || 'N',
                userId: post.userId || (currentUser ? currentUser.userId : null), // 기존 post의 userId를 우선, 없으면 currentUser
                restaurantId: post.restaurantId || 1
            });
            if (post.images && post.images.length > 0) {
                setExistingImages(post.images);
            }
        } else if (!isEditMode && currentUser) { // 새 글 작성 모드이고 로그인되어 있다면
            setFormData(prev => ({
                ...prev,
                userId: currentUser.userId
            }));
        }
    }, [isEditMode, post, currentUser]); // currentUser를 의존성 배열에 추가

    // 메시지 처리
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage, error, setError]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
        }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }, []);

    const handleRemovePreview = useCallback((indexToRemove) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleRemoveExistingImage = useCallback((imageIdToRemove) => {
        setExistingImages(prev => prev.filter(img => img.imageId !== imageIdToRemove));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.userId || !currentUser.userLoginId) {
            setError('로그인이 필요합니다.');
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                userId: currentUser.userId, // 현재 로그인된 사용자 ID를 명시적으로 설정
                createdId: currentUser.userLoginId, // 로그인 ID를 createdId로 설정
                updatedId: currentUser.userLoginId // 로그인 ID를 updatedId로 설정
            };

            // ruleId가 1이 아닌 경우 공지사항 여부 강제로 'N'으로 설정
            if (currentUser.ruleId !== 1) { //
                dataToSubmit.isNotice = 'N';
            }

            if (isEditMode) {
                // 수정 모드: 게시글 ID와 함께 업데이트
                await modifyPost(parseInt(id), dataToSubmit, selectedFiles);
                setMessage('게시글이 성공적으로 수정되었습니다.');
            } else {
                // 생성 모드
                await addPost(dataToSubmit, selectedFiles);
                setMessage('게시글이 성공적으로 작성되었습니다.');
                // 폼 초기화
                setFormData({
                    postTitle: '',
                    postContent: '',
                    locationTag: '',
                    isNotice: 'N',
                    userId: currentUser.userId, // 초기화 시 현재 사용자 ID 유지
                    restaurantId: 1
                });
                setSelectedFiles([]);
                setImagePreviews([]);
            }
            navigate('/posts'); // 목록으로 이동
        } catch (err) {
            console.error('게시글 저장 오류:', err);
            setError(err.response?.data?.message || '게시글 저장에 실패했습니다.'); // 백엔드 에러 메시지 표시
        }
    }, [isEditMode, id, formData, selectedFiles, addPost, modifyPost, navigate, setMessage, setError, currentUser]);


    // 로그인되지 않은 경우
    if (!currentUser) {
        return (
            <div className="post-form-page">
                <p className="error-message">게시글을 작성하거나 수정하려면 로그인이 필요합니다.</p>
                <button onClick={() => navigate('/login')} className="post-button post-back-button">로그인 페이지로 이동</button>
            </div>
        );
    }

    if (loading && isEditMode && !post) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="post-form-page">
            <div className="post-form-container">
                <div className="post-form-wrapper">
                    <h2>{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h2>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit} className="post-form">
                        <div className="form-group">
                            <label htmlFor="postTitle" className="form-label">제목</label>
                            <input
                                type="text"
                                id="postTitle"
                                name="postTitle"
                                value={formData.postTitle}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="postContent" className="form-label">내용</label>
                            <textarea
                                id="postContent"
                                name="postContent"
                                value={formData.postContent}
                                onChange={handleChange}
                                className="form-textarea"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="locationTag" className="form-label">위치 태그</label>
                            <input
                                type="text"
                                id="locationTag"
                                name="locationTag"
                                value={formData.locationTag}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        {/* 이미지 업로드 필드 추가 */}
                        <div className="form-group">
                            <label htmlFor="images" className="form-label">이미지 첨부</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-input-file"
                            />
                        </div>

                        {/* 이미지 미리보기 영역 */}
                        <div className="image-preview-container">
                            {isEditMode && existingImages.length > 0 && (
                                <div className="existing-images-preview">
                                    <h4>기존 이미지:</h4>
                                    <div className="image-thumbnails">
                                        {existingImages.map((image, index) => (
                                            <div key={image.imageId} className="thumbnail-wrapper">
                                                <img src={image.imageUrl} alt={`기존 이미지 ${index + 1}`} className="thumbnail-image" />
                                                <button type="button" onClick={() => handleRemoveExistingImage(image.imageId)} className="remove-image-button">X</button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="help-text">새로운 이미지를 업로드하면 기존 이미지는 모두 대체됩니다.</p>
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="selected-images-preview">
                                    <h4>새로 선택된 이미지:</h4>
                                    <div className="image-thumbnails">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="thumbnail-wrapper">
                                                <img src={src} alt={`선택된 이미지 ${index + 1}`} className="thumbnail-image" />
                                                <button type="button" onClick={() => handleRemovePreview(index)} className="remove-image-button">X</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* ruleId가 1일 때만 공지사항 여부 체크박스 렌더링 */}
                        {currentUser && currentUser.ruleId === 1 && ( //
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
                        )}
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
