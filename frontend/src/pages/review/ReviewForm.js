import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { summarizeReview } from '../../api/AiApi'; // AI API 호출 함수 임포트
import './ReviewForm.css';

function ReviewForm({ restaurantId, userId, userNickname, existingReview, onReviewSubmitted, onCancel }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingReview) {
            setReviewContent(existingReview.reviewContent);
            setReviewRating(existingReview.reviewRating);
        } else {
            setReviewContent('');
            setReviewRating(0);
        }
    }, [existingReview]);

    const handleRatingClick = (rating) => {
        setReviewRating(rating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewContent.trim() || reviewRating === 0) {
            alert("별점과 내용을 모두 입력해 주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. 리뷰 내용을 AI 요약 API에 보냅니다.
            const aiResponse = await summarizeReview(reviewContent);

            // 2. AI 응답을 포함하여 리뷰 데이터를 구성합니다.
            const reviewData = {
                restaurantId,
                userId,
                reviewRating,
                reviewContent,
                aiSummary: aiResponse.summary,
                aiKeywords: aiResponse.keywords.join(', '),
                userNickname: userNickname
            };

            // 3. 리뷰를 백엔드에 전송합니다 (수정 또는 등록)
            let response;
            if (existingReview) {
                // 기존 리뷰 수정
                response = await axios.put(`http://localhost:8080/api/reviews/${existingReview.reviewId}`, {
                    ...reviewData,
                    reviewId: existingReview.reviewId,
                });
            } else {
                // 새 리뷰 등록
                response = await axios.post('http://localhost:8080/api/reviews', reviewData);
            }

            if (response.data?.status === 'success') {
                alert(`리뷰가 ${existingReview ? '수정' : '등록'}되었습니다!`);
                onReviewSubmitted(); // 성공 시 부모 컴포넌트에 알림
            } else {
                alert(`리뷰 ${existingReview ? '수정' : '등록'}에 실패했습니다: ${response.data?.message || '알 수 없는 오류'}`);
            }

        } catch (error) {
            console.error('리뷰 전송 중 오류 발생:', error);
            alert(`리뷰 ${existingReview ? '수정' : '등록'} 중 오류가 발생했습니다.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>{existingReview ? '리뷰 수정하기' : '새 리뷰 작성하기'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="review-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star-icon ${star <= reviewRating ? 'filled' : ''}`}
                            onClick={() => handleRatingClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    className="review-content-input"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="솔직한 리뷰를 남겨주세요."
                    rows="5"
                ></textarea>
                <div className="form-actions">
                    <button type="submit" className="submit-button11" disabled={isSubmitting}>
                        {isSubmitting ? '전송 중...' : (existingReview ? '수정 완료' : '리뷰 등록')}
                    </button>
                    <button type="button" className="cancel-button11" onClick={onCancel} disabled={isSubmitting}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;