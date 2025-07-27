import React, { useState, useEffect, useCallback } from 'react';
import { MdPushPin, MdLink } from 'react-icons/md';
import { FaExclamationTriangle } from 'react-icons/fa';
import Modal from 'react-modal';
import axios from 'axios';
import ReviewForm from '../../review/ReviewForm'; 
import { summarizeReview } from '../../../api/AiApi';
import './RestaurantDetailModal.css';
import { reportReview } from '../../../api/RestaurantApi';
import ReportModal from './ReportModal';

Modal.setAppElement('#root');

function RestaurantDetailModal({ isOpen, onRequestClose, restaurant, currentUser, onReviewSubmitted }) {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [targetReview, setTargetReview] = useState(null);

    const [restaurantAiSummary, setRestaurantAiSummary] = useState('');
    const [restaurantAiKeywords, setRestaurantAiKeywords] = useState([]);

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
                const fetchedReviews = response.data.data;
                setReviews(fetchedReviews);
                // 리뷰가 성공적으로 로드되면 AI 요약 통합 함수 호출
                if (fetchedReviews.length > 0) {
                    summarizeRestaurantReviews(fetchedReviews);
                }
            } else {
                setReviewError(response.data?.message || '리뷰 목록 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 조회 중 오류 발생:', error);
            setReviewError('서버에서 리뷰를 가져오는 데 실패했습니다.');
        } finally {
            setLoadingReviews(false);
        }
    };

    const summarizeRestaurantReviews = async (allReviews) => {
        try {
            // 모든 AI 요약과 키워드를 결합
            const combinedSummary = allReviews
                .map(r => r.aiSummary)
                .filter(Boolean) // null 또는 빈 문자열 제외
                .join(' ');
            const combinedKeywords = allReviews
                .flatMap(r => r.aiKeywords ? r.aiKeywords.split(',').map(k => k.trim()) : [])
                .filter(Boolean);

            if (combinedSummary) {
                // AiApi.js에 새로운 함수를 만들어 호출
                // 현재는 기존 summarizeReview를 활용
                const finalAiResult = await summarizeReview(combinedSummary + ' ' + combinedKeywords.join(' '));
                
                setRestaurantAiSummary(finalAiResult.summary);
                setRestaurantAiKeywords(finalAiResult.keywords);
            }
        } catch (error) {
            console.error("레스토랑 전체 요약 생성 중 오류 발생:", error);
            // 오류 처리
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

    const formatTime = (hour, minute) => {
        if (hour === null || hour === undefined) {
            return '없음';
        }

        const ampm = hour < 12 ? '오전' : '오후';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        
        // 분 데이터가 없는 경우를 처리
        const displayMinute = minute !== null && minute !== undefined ? `${minute}분` : '';

        return `${ampm} ${displayHour}시 ${displayMinute}`.trim();
    };

    // 리뷰 제출 성공 시 호출될 함수
    const handleReviewSubmitted = () => {
        // 폼을 숨기고, 리뷰 목록을 새로고침
        setShowReviewForm(false);
        setEditingReview(null);
        fetchReviews(restaurant.restaurantId);
        if (onReviewSubmitted) { 
            onReviewSubmitted();
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.reviewRating || 0), 0) / reviews.length).toFixed(1)
        : '0.0';

    //  리뷰 신고 처리
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleOpenReportModal = (review) => {
        setTargetReview(review);
        setIsReportModalOpen(true);
    };

    const handleReviewReport = async (reportReason) => {
        if (!targetReview) {
            alert('신고 대상 리뷰를 찾을 수 없습니다.');
            return;
        }

        try {
            // targetReview 객체에서 필요한 정보를 추출하여 전달
            await reportReview(
                targetReview.reviewId,
                reportReason,
                targetReview.reviewContent,
                targetReview.userNickname,
                targetReview.userId
            );
            alert('리뷰 신고가 접수되었습니다. 감사합니다.');
            setIsReportModalOpen(false);
            fetchReviews(restaurant.restaurantId);
        } catch (err) {
            alert(err.message || '리뷰 신고 중 오류가 발생했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Restaurant Detail Modal"
            className="restaurant-detail-modal"
            overlayClassName="restaurant-detail-overlay"
        >
            <div>
                
                <h2>{restaurant?.restaurantName}</h2>
                <p>주소: {`${restaurant?.addrSido || ''} ${restaurant?.addrSigungu || ''} ${restaurant?.addrDong || ''} ${restaurant?.addrDetail || ''}`}</p>
                <p>전화번호: {restaurant?.phoneNumber}</p>
                <p>영업시간: {formatTime(restaurant?.openHour, restaurant?.openMinute)} ~ {formatTime(restaurant?.closeHour, restaurant?.closeMinute)}</p>
                {restaurant?.breakStartHour !== null || restaurant?.breakEndHour !== null ? (
                    <p>브레이크타임: {formatTime(restaurant?.breakStartHour, restaurant?.breakStartMinute)} ~ {formatTime(restaurant?.breakEndHour, restaurant?.breakEndMinute)}</p>
                ) : (
                    <p>브레이크타임: 없음</p>
                )}
                
                <p>주차정보: {restaurant?.parkingInfo || '주차 불가능'}</p>
                <p>카테고리: {restaurant?.restaurantCategory}</p>

                <div className="modal-divider">
                    <a 
                        href={`https://place.map.kakao.com/${restaurant.kakaoPlaceId}#menuInfo`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kakao-map-link-button"
                    >
                        <MdLink style={{ marginRight: '6px' }} />
                        카카오맵에서 메뉴 확인하기
                    </a>
                </div>

                <div className="modal-divider">
                    {restaurantAiSummary && (
                    <div className="restaurant-ai-summary">
                        <h3>
                            <MdPushPin style={{ verticalAlign: 'middle', marginRight: '6px', color: '#f39c12' }} />
                            AI 종합 요약
                        </h3>
                        <p>{restaurantAiSummary}</p>
                        {restaurantAiKeywords.length > 0 && (
                            <p>
                                <strong>키워드:</strong> {restaurantAiKeywords.map(k => `#${k.trim()}`).join(' ')}
                            </p>
                        )}
                    </div>
                )}
                </div>

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
                                            <span className="review-date">
                                                {new Date(review.createdDate).toLocaleDateString()}
                                            </span>
                                            <div className="review-meta">
                                                <span className="review-author">
                                                    {review.userNickname || '익명'}
                                                </span>
                                                <span className="review-rating">
                                                    {'★'.repeat(Math.floor(review.reviewRating))}
                                                    {'☆'.repeat(5 - Math.floor(review.reviewRating))}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {console.log('Rendering review:', review)}
                                        {console.log('Current user:', currentUser)}
                                        {console.log('Condition check for report button:', review.userId !== 1 && review.userNickname !== '관리자')}

                                        <div className="review-actions">
                                            {currentUser && (
                                                <>
                                                    {/* 시나리오 A: 리뷰 작성자 본인이거나 로그인한 사용자가 관리자인 경우 (수정/삭제 권한) */}
                                                    {(currentUser.userId === review.userId || currentUser.ruleId === 1) && (
                                                        <>
                                                            <button onClick={() => handleEditReview(review)}>수정</button>
                                                            <button onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                                        </>
                                                    )}

                                                    {/* 시나리오 B: 현재 로그인한 사용자가 관리자이면서, 리뷰 작성자가 관리자가 아닌 경우 (관리자가 일반 유저 리뷰를 신고) */}
                                                    {currentUser.ruleId === 1 && review.userId !== 1 && review.userNickname !== '관리자' && (
                                                        <button
                                                            onClick={() => handleOpenReportModal(review)}
                                                            className="icon-button"
                                                            title="리뷰 신고"
                                                        >
                                                            <FaExclamationTriangle />
                                                        </button>
                                                    )}

                                                    {/* 시나리오 C: 현재 로그인한 사용자가 일반 유저이면서, 리뷰 작성자가 본인이 아니고, 리뷰 작성자가 관리자가 아닌 경우 (일반 유저가 다른 일반 유저 리뷰를 신고) */}
                                                    {currentUser.ruleId !== 1 && currentUser.userId !== review.userId && review.userId !== 1 && review.userNickname !== '관리자' && (
                                                        <button
                                                            onClick={() => handleOpenReportModal(review)}
                                                            className="icon-button"
                                                            title="리뷰 신고"
                                                        >
                                                            <FaExclamationTriangle />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <p>{review.reviewContent}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            <button className="modal-close-button" onClick={onRequestClose}>닫기</button>
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onReport={handleReviewReport} // 완성된 리뷰 신고 함수 연결
                target="리뷰"
            />
        </Modal>
    );
}

export default RestaurantDetailModal;