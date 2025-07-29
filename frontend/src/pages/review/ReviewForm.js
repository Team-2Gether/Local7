import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { summarizeReview } from '../../api/AiApi'; 
import apiClient from '../../api/RestaurantApi'; 

import './ReviewForm.css';

function ReviewForm({ restaurantId, userId, userNickname, existingReview, onReviewSubmitted, onCancel }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(''); // 사용자에게 메시지를 표시하기 위한 상태

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
        setMessage(''); // 메시지 초기화

        if (!reviewContent.trim() || reviewRating === 0) {
            setMessage("별점과 내용을 모두 입력해 주세요."); // alert 대신 메시지 상태 사용
            return;
        }

        setIsSubmitting(true);

        let aiSummary = null;
        let aiKeywords = null;

        try {
            // 1. 리뷰 내용을 AI 요약 API에 보냅니다.
            // AI 서버가 작동하지 않아도 리뷰 등록이 가능하도록 try-catch로 감쌉니다.
            const aiResponse = await summarizeReview(reviewContent);
            aiSummary = aiResponse.summary;
            aiKeywords = aiResponse.keywords ? aiResponse.keywords.join(', ') : null;
        } catch (aiError) {
            console.error('AI 요약 API 호출 중 오류 발생:', aiError);
            setMessage('AI 요약 생성에 실패했습니다. 리뷰는 AI 요약 없이 등록됩니다.');
            // AI 요약 및 키워드는 null로 유지됩니다.
        }

        try {
            // 2. AI 응답을 포함하여 리뷰 데이터를 구성합니다.
            const reviewData = {
                restaurantId,
                userId,
                reviewRating,
                reviewContent,
                aiSummary, // AI 요약 결과
                aiKeywords, // AI 키워드 결과
                createdId: userNickname || 'anonymous', // ReviewVO의 createdId 필드에 userNickname 설정
                updatedId: userNickname || 'anonymous' // ReviewVO의 updatedId 필드에 userNickname 설정
            };

            let response;
            if (existingReview) {
                // 기존 리뷰 수정 (apiClient 사용)
                response = await apiClient.put(`/reviews/${existingReview.reviewId}`, reviewData);
                setMessage('리뷰가 성공적으로 수정되었습니다.');
            } else {
                // 새 리뷰 등록 (apiClient 사용)
                response = await apiClient.post('/reviews', reviewData);
                setMessage('리뷰가 성공적으로 등록되었습니다.');
            }

            // 리뷰 제출 성공 후 부모 컴포넌트에 알림
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data); // 응답 데이터를 전달
            }

            // 폼 초기화
            setReviewContent('');
            setReviewRating(0);

        } catch (error) {
            console.error('리뷰 전송 중 오류 발생:', error);
            setMessage(error.response?.data?.message || '리뷰 전송 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>{existingReview ? '리뷰 수정하기' : '새 리뷰 작성하기'}</h3>
            <form onSubmit={handleSubmit}>
                {/* 메시지 표시 */}
                {message && <p className="error-message">{message}</p>} 
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
