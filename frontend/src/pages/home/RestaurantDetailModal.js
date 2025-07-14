import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ReviewForm from '../review/ReviewForm'; // ReviewForm 임포트 경로 확인!

import './RestaurantDetailModal.css';

Modal.setAppElement('#root');

function RestaurantDetailModal({ isOpen, onRequestClose, restaurant, currentUser }) {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null); 

    // restaurantId가 변경될 때마다 리뷰를 다시 로드
    useEffect(() => {
        if (isOpen && restaurant?.restaurantId) {
            fetchReviews(restaurant.restaurantId);
            setShowReviewForm(false); // 모달 열릴 때 리뷰 폼 숨김
            setEditingReview(null); // 수정 모드 초기화
        } else {
            setReviews([]); // 모달 닫힐 때 리뷰 초기화
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
                setReviewError(response.data?.message || '리뷰를 불러오는 데 실패했습니다.');
            }
        } catch (err) {
            console.error('리뷰 불러오기 오류:', err);
            setReviewError('리뷰를 불러오는 중 네트워크 오류가 발생했습니다.');
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleReviewSubmitted = () => {
        setShowReviewForm(false); // 폼 제출 후 폼 숨기기
        setEditingReview(null); // 수정 모드 해제
        fetchReviews(restaurant.restaurantId); // 리뷰 목록 새로고침
    };

    const handleEditReview = (review) => {
        setEditingReview(review); // 수정할 리뷰 설정
        setShowReviewForm(true); // 리뷰 폼 표시
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
                if (response.data?.status === 'success') {
                    alert(response.data.message);
                    fetchReviews(restaurant.restaurantId); // 리뷰 목록 새로고침
                } else {
                    alert(response.data?.message || '리뷰 삭제에 실패했습니다.');
                }
            } catch (err) {
                console.error('리뷰 삭제 오류:', err);
                alert('리뷰 삭제 중 네트워크 오류가 발생했습니다.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setShowReviewForm(false);
    };

    // 모달 닫기 요청 시 폼 상태 초기화
    const handleRequestClose = () => {
        setShowReviewForm(false);
        setEditingReview(null);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleRequestClose}
            className="restaurant-detail-modal"
            overlayClassName="restaurant-detail-overlay"
            contentLabel="Restaurant Details"
        >
            <div className="modal-header-kakao">
                <div className="title-section">
                    <h3>{restaurant.restaurantName}</h3>
                    <p className="category">{restaurant.restaurantCategory}</p>
                </div>
                <button onClick={handleRequestClose} className="close-button">&times;</button>
            </div>

            <div className="modal-body">
                <p><strong>주소:</strong> {`${restaurant.addrSido || ''} ${restaurant.addrSigungu || ''} ${restaurant.addrDong || ''} ${restaurant.addrDetail || ''}`}</p>
                <p><strong>전화번호:</strong> {restaurant.phoneNumber || '정보 없음'}</p>
                <p><strong>영업 시간:</strong> {restaurant.openHour !== null ? `${restaurant.openHour}:${String(restaurant.openMinute).padStart(2, '0')} ~ ${restaurant.closeHour}:${String(restaurant.closeMinute).padStart(2, '0')}` : '정보 없음'}</p>
                {restaurant.breakStartHour !== null && (
                    <p><strong>브레이크 타임:</strong> {`${restaurant.breakStartHour}:${String(restaurant.breakStartMinute).padStart(2, '0')} ~ ${restaurant.breakEndHour}:${String(restaurant.breakEndMinute).padStart(2, '0')}`}</p>
                )}
                <p><strong>휴무일:</strong> {restaurant.restaurantHoliday || '정보 없음'}</p>
                <p><strong>주차 정보:</strong> {restaurant.parkingInfo || '정보 없음'}</p>

                <hr />

                <div className="review-section">
                    <h4>리뷰</h4>
                    {currentUser && ( // 로그인된 사용자만 리뷰 작성 버튼 표시
                        <button onClick={() => setShowReviewForm(!showReviewForm)} className="toggle-review-form-button">
                            {showReviewForm ? '리뷰 폼 숨기기' : (editingReview ? '리뷰 수정 폼' : '리뷰 작성')}
                        </button>
                    )}

                    {showReviewForm && (
                        <ReviewForm
                            restaurantId={restaurant.restaurantId}
                            onReviewSubmitted={handleReviewSubmitted}
                            editingReview={editingReview}
                            onCancelEdit={handleCancelEdit}
                            currentUser={currentUser} // 현재 사용자 정보를 ReviewForm에 전달
                        />
                    )}

                    {loadingReviews ? (
                        <p>리뷰 로딩 중...</p>
                    ) : reviewError ? (
                        <p className="error-message">{reviewError}</p>
                    ) : reviews.length === 0 ? (
                        <p>아직 작성된 리뷰가 없습니다.</p>
                    ) : (
                        <ul className="review-list">
                            {reviews.map((review) => (
                                <li key={review.reviewId} className="review-item">
                                    <div className="review-header">
                                        {/* TODO: review.userId를 사용하여 사용자 닉네임/ID 표시 */}
                                        <span className="review-user">{review.userNickname || `사용자 ${review.userId}`}</span>
                                        <span className="review-rating">
                                            {'★'.repeat(Math.floor(review.reviewRating))}
                                            {'☆'.repeat(5 - Math.floor(review.reviewRating))}
                                        </span>
                                        <span className="review-date">{new Date(review.createdDate).toLocaleDateString()}</span>
                                    </div>
                                    <p className="review-content">{review.reviewContent}</p>
                                    {review.aiSummary && <p className="review-ai-summary">**AI 요약:** {review.aiSummary}</p>}
                                    {review.aiKeywords && <p className="review-ai-keywords">**키워드:** {review.aiKeywords}</p>}
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
            </div>
        </Modal>
    );
}

export default RestaurantDetailModal;
