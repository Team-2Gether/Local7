import React, { useState, useEffect } from 'react';
import axios from 'axios';



function ReviewForm({ restaurantId, onReviewSubmitted, editingReview, onCancelEdit, currentUser }) {

    // editingReview가 있으면 수정 모드, 없으면 새 리뷰 작성 모드
    const [rating, setRating] = useState(editingReview ? editingReview.reviewRating : 0);
    const [content, setContent] = useState(editingReview ? editingReview.reviewContent : '');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // editingReview가 변경될 때마다 폼 필드 업데이트
    useEffect(() => {
        if (editingReview) {
            setRating(editingReview.reviewRating);
            setContent(editingReview.reviewContent);
        } else {
            setRating(0);
            setContent('');
        }
        setError(null); // 폼 초기화 시 에러 메시지 초기화
    }, [editingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!currentUser || !currentUser.userId) {
            setError("리뷰를 작성하려면 로그인해야 합니다.");
            setIsSubmitting(false);
            return;
        }

        if (rating === 0) {
            setError("별점을 선택해주세요.");
            setIsSubmitting(false);
            return;
        }
        if (content.trim() === '') {
            setError("리뷰 내용을 입력해주세요.");
            setIsSubmitting(false);
            return;
        }

        const reviewData = {
            userId: currentUser.userId, // 현재 로그인된 사용자 ID
            restaurantId: restaurantId,
            reviewRating: rating,
            reviewContent: content,
            aiSummary: null,
            aiKeywords: null,
        };

        try {
            let response;
            if (editingReview) {
                // 리뷰 수정
                response = await axios.put(`http://localhost:8080/api/reviews/${editingReview.reviewId}`, reviewData);
            } else {
                // 새 리뷰 작성
                response = await axios.post('http://localhost:8080/api/reviews', reviewData);
            }

            if (response.data?.status === 'success') {
                alert(response.data.message); // 사용자에게 성공 메시지 표시
                onReviewSubmitted(); // 리뷰 목록 새로고침 또는 업데이트 콜백 호출
                setRating(0); // 폼 초기화
                setContent('');
                if (onCancelEdit) onCancelEdit(); // 수정 모드 취소
            } else {
                setError(response.data?.message || '리뷰 처리 중 오류가 발생했습니다.');
            }
        } catch (err) {
            console.error('리뷰 제출 오류:', err);
            setError('리뷰 처리 중 네트워크 오류가 발생했습니다. 서버를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h4>{editingReview ? '리뷰 수정' : '새 리뷰 작성'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="rating">별점:</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(parseFloat(e.target.value))}
                        disabled={isSubmitting}
                    >
                        <option value="0">별점 선택</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}점</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="content">리뷰 내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        placeholder="리뷰 내용을 입력해주세요."
                        disabled={isSubmitting}
                    ></textarea>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '처리 중...' : (editingReview ? '리뷰 수정' : '리뷰 작성')}
                    </button>
                    {editingReview && (
                        <button type="button" onClick={onCancelEdit} disabled={isSubmitting}>
                            취소
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ReviewForm; 
