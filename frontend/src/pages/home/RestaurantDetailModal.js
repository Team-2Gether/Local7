import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ReviewForm from '../review/ReviewForm'; 

import './RestaurantDetailModal.css';

Modal.setAppElement('#root');

function RestaurantDetailModal({ isOpen, onRequestClose, restaurant, currentUser }) {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    // `showReviewForm` 상태에 따라 텍스트를 변경합니다.
    const reviewFormButtonText = showReviewForm ? '리뷰 목록 보기' : '리뷰 작성하기';

    useEffect(() => {
        if (isOpen && restaurant?.restaurantId) {
            fetchReviews(restaurant.restaurantId);
            // 모달이 열릴 때 리뷰 폼을 숨깁니다.
            setShowReviewForm(false);
            setEditingReview(null);
        } else {
            setReviews([]);
            setReviewError(null);
        }
    }, [isOpen, restaurant?.restaurantId]);

    const fetchReviews = async (restaurantId) => {
        setLoadingReviews(true);
        setReviewError(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/restaurant/${restaurantId}`);
            if (response.data?.status === 'success') {
                setReviews(response.data.data);
            } else {
                setReviewError(response.data?.message || '리뷰 로딩 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviewError('리뷰 데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
                if (response.data?.status === 'success') {
                    alert('리뷰가 삭제되었습니다.');
                    fetchReviews(restaurant.restaurantId); // 리뷰 목록 새로고침
                } else {
                    alert('리뷰 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('리뷰 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // 리뷰 제출 성공 시 호출될 함수
    const handleReviewSubmitted = () => {
        // 폼을 숨기고, 리뷰 목록을 새로고침
        setShowReviewForm(false);
        setEditingReview(null);
        fetchReviews(restaurant.restaurantId);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.reviewRating || 0), 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Restaurant Detail Modal"
            className="restaurant-detail-modal"
            overlayClassName="restaurant-detail-overlay"
        >
            <div className="modal-content">
                <h2>{restaurant?.restaurantName}</h2>
                <p>주소: {`${restaurant?.addrSido || ''} ${restaurant?.addrSigungu || ''} ${restaurant?.addrDong || ''} ${restaurant?.addrDetail || ''}`}</p>
                <p>전화번호: {restaurant?.phoneNumber}</p>
                <p>카테고리: {restaurant?.restaurantCategory}</p>

                <div className="modal-divider"></div>

                <div className="average-rating-container">
                    <p className="average-rating-text">
                        평점:
                        <span className="average-rating-stars">
                            {'★'.repeat(Math.floor(averageRating))}
                            {'☆'.repeat(5 - Math.floor(averageRating))}
                        </span>
                        <span className="average-rating-value">{averageRating}</span>
                        <span className="review-count">({reviews.length}개 리뷰)</span>
                    </p>
                </div>

                <div className="modal-divider"></div>

                {/* 리뷰 작성/목록 전환 버튼 */}
                <div className="review-action-buttons">
                    {currentUser && (
                        <button className="add-review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
                            {reviewFormButtonText}
                        </button>
                    )}
                </div>

                {/* showReviewForm 상태에 따라 ReviewForm 또는 리뷰 목록을 렌더링 */}
                {showReviewForm ? (
                    <ReviewForm
                        restaurantId={restaurant.restaurantId}
                        userId={currentUser.userId}
                        userNickname={currentUser.userNickname}
                        existingReview={editingReview}
                        onReviewSubmitted={handleReviewSubmitted}
                        onCancel={() => { setShowReviewForm(false); setEditingReview(null); }}
                    />
                ) : (
                    <div className="review-list-container">
                        <h3>리뷰</h3>
                        {loadingReviews ? (
                            <p>리뷰를 로딩 중입니다...</p>
                        ) : reviewError ? (
                            <p className="error-message">{reviewError}</p>
                        ) : reviews.length === 0 ? (
                            <p>등록된 리뷰가 없습니다. 첫 리뷰를 작성해 보세요!</p>
                        ) : (
                            <ul className="review-list">
                                {reviews.map((review) => (
                                    <li key={review.reviewId} className="review-item">
                                        <div className="review-header">
                                            <span className="review-author">{review.userNickname || '익명'}</span>
                                            <span className="review-rating">
                                                {'★'.repeat(Math.floor(review.reviewRating))}
                                                {'☆'.repeat(5 - Math.floor(review.reviewRating))}
                                            </span>
                                            <span className="review-date">{new Date(review.createdDate).toLocaleDateString()}</span>
                                        </div>
                                        <p className="review-content">{review.reviewContent}</p>
                                        {review.aiSummary && (
                                            <p className="review-ai-summary">
                                                <strong>AI 요약:</strong> {review.aiSummary}
                                            </p>
                                        )}
                                        {review.aiKeywords && (
                                            <p className="review-ai-keywords">
                                                <strong>키워드: </strong><span>{review.aiKeywords}</span> 
                                            </p>
                                        )}
                                        {currentUser && currentUser.userId === review.userId && (
                                            <div className="review-actions">
                                                <button onClick={() => handleEditReview(review)}>수정</button>
                                                <button onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            <button className="modal-close-button" onClick={onRequestClose}>닫기</button>
        </Modal>
    );
}

export default RestaurantDetailModal;