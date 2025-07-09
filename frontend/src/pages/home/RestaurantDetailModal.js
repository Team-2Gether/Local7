import React from 'react';
import Modal from 'react-modal';
import './RestaurantDetailModal.css'; // 모달 스타일을 위한 CSS 파일

// 모달이 앱의 루트 요소에 바인딩되도록 설정
Modal.setAppElement('#root');

function RestaurantDetailModal({ isOpen, onRequestClose, restaurant }) {
    if (!restaurant) {
        return null; // restaurant 객체가 없으면 아무것도 렌더링하지 않음
    }

    // 주소 필드들을 조합
    const fullAddress = `${restaurant.addrSido || ''} ${restaurant.addrSigungu || ''} ${restaurant.addrDong || ''} ${restaurant.addrDetail || ''}`.trim();

    // 영업 시간과 브레이크 타임 표시 함수
    const formatTime = (hour, minute) => {
        if (hour == null || minute == null) return '정보 없음';
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    const displayOperatingHours = () => {
        const open = formatTime(restaurant.openHour, restaurant.openMinute);
        const close = formatTime(restaurant.closeHour, restaurant.closeMinute);
        let hours = `매일 ${open} - ${close}`;

        if (restaurant.breakStartHour != null && restaurant.breakEndHour != null) {
            const breakStart = formatTime(restaurant.breakStartHour, restaurant.breakStartMinute);
            const breakEnd = formatTime(restaurant.breakEndHour, restaurant.breakEndMinute);
            hours += ` (브레이크타임 ${breakStart} - ${breakEnd})`;
        }
        return hours;
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="음식점 상세 정보"
            className="restaurant-detail-modal"
            overlayClassName="restaurant-detail-overlay"
        >
            <div className="modal-header-kakao">
                <div className="title-section">
                    <h3>{restaurant.restaurantName}</h3>
                    <span className="category">{restaurant.restaurantCategory}</span>
                </div>
                <button onClick={onRequestClose} className="close-button-kakao">&times;</button>
            </div>
            <div className="modal-body-kakao">
                <div className="info-item">
                    <span className="info-label">주소</span>
                    <span className="info-content">{fullAddress}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">전화</span>
                    <span className="info-content">{restaurant.phoneNumber || '정보 없음'}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">영업시간</span>
                    <span className="info-content">{displayOperatingHours()}</span>
                </div>
                {restaurant.restaurantHoliday && (
                    <div className="info-item">
                        <span className="info-label">휴무일</span>
                        <span className="info-content">{restaurant.restaurantHoliday}</span>
                    </div>
                )}
                {restaurant.parkingInfo && (
                    <div className="info-item">
                        <span className="info-label">주차</span>
                        <span className="info-content">{restaurant.parkingInfo}</span>
                    </div>
                )}
                <div className="link-section">
                    <a
                        href={`https://map.kakao.com/link/map/${restaurant.restaurantName},${restaurant.restaurantLat},${restaurant.restaurantLon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kakao-map-full-link"
                    >
                        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapilogo/places_management.png" alt="카카오맵 아이콘" />
                        큰 지도 보기
                    </a>
                </div>
            </div>
        </Modal>
    );
}

export default RestaurantDetailModal;