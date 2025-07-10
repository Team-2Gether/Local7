// src/pages/home/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar'; // Sidebar 컴포넌트 임포트
import AiModal from '../ai/components/AiModal'; // AiModal 임포트 (경로 확인해주세요)
import UserPage from '../user/UserPage'; // UserPage 임포트 추가
import './Home.css'; // Home.css 임포트 추가
import RestaurantDetailModal from './RestaurantDetailModal'; // RestaurantDetailModal 임포트 추가
import RestaurantVote from '../restaurant/RestaurantVote';

// Home 컴포넌트는 currentUser prop을 받습니다.
function Home({ currentUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  // 사이드바 및 AI 모달 관련 상태
  const [activeContent, setActiveContent] = useState('home'); // 현재 활성화된 콘텐츠 (home, add, mypage, ai)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false); // AI 모달 열림/닫힘 상태

  // 음식점 상세 모달 관련 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 모달 열림/닫힘 상태
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // 선택된 음식점 정보

  // 사이드바 메뉴 클릭 핸들러
  const handleSidebarClick = (item) => {
    if (item === 'ai') {
      setIsAiModalOpen(true); // AI 버튼 클릭 시 모달 열기
    } else {
      setActiveContent(item); // 다른 버튼 클릭 시 콘텐츠 변경
      setIsAiModalOpen(false); // 혹시 열려있을 AI 모달 닫기
    }
  };

  // 음식점 클릭 핸들러 (상세 모달 열기)
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  // Kakao Map 로드 및 음식점 데이터 가져오기 (Home 콘텐츠에만 로드되도록)
  useEffect(() => {
    // activeContent가 'home'일 때만 지도를 로드하고 데이터를 가져옵니다.
    if (activeContent === 'home') {
      const script = document.createElement('script');
      // Kakao Maps API Key를 올바르게 입력해주세요.
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (!container) {
            console.warn(
              "Kakao map container 'map' not found. Skipping map initialization."
            );
            return;
          }
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청으로 기본 중심 변경
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);

          // GPS 현재 위치를 가져오는 함수 (이 부분은 유지하되, 필요에 따라 기본 위치 로직과 병합)
          const getCurrentLocation = () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  const locPosition = new window.kakao.maps.LatLng(lat, lon);
                  map.setCenter(locPosition); // 현재 위치로 지도 중심 이동

                  // 현재 위치에 마커 표시
                  new window.kakao.maps.Marker({
                    map: map,
                    position: locPosition,
                    title: '현재 위치',
                  });
                },
                (err) => {
                  console.error('Geolocation 에러 발생:', err);
                  // GPS를 가져오지 못할 경우, 위에서 설정한 '서울 시청'으로 유지됩니다.
                  alert(
                    '현재 위치를 가져올 수 없습니다. 설정된 기본 위치로 지도를 로드합니다.'
                  );
                },
                {
                  enableHighAccuracy: true,
                  maximumAge: 0,
                  timeout: 5000,
                }
              );
            } else {
              alert(
                '이 브라우저에서는 Geolocation을 지원하지 않습니다. 설정된 기본 위치로 지도를 로드합니다.'
              );
            }
          };

          getCurrentLocation(); // 페이지 로드 시 현재 위치 가져오기 (만약 사용자의 GPS를 우선하려면 이 부분은 유지)

          axios
            .get('http://localhost:8080/api/restaurants')
            .then((response) => {
              if (
                response.data &&
                response.data.status === 'success' &&
                Array.isArray(response.data.data)
              ) {
                const fetchedRestaurants = response.data.data.filter(
                  (restaurant) => restaurant != null
                );
                setRestaurants(fetchedRestaurants);

                const bounds = new window.kakao.maps.LatLngBounds();
                fetchedRestaurants.forEach((restaurant) => {
                  if (restaurant.restaurantLat && restaurant.restaurantLon) {
                    // 필드명 변경
                    const markerPosition = new window.kakao.maps.LatLng(
                      parseFloat(restaurant.restaurantLat), // 필드명 변경
                      parseFloat(restaurant.restaurantLon) // 필드명 변경
                    );
                    const marker = new window.kakao.maps.Marker({
                      map: map,
                      position: markerPosition,
                      title: restaurant.restaurantName,
                    });

                    // 마커 클릭 시 상세 정보 윈도우 표시 (기존 Infowindow는 유지하되, 목록 클릭 시 모달이 뜨도록 변경)
                    window.kakao.maps.event.addListener(
                      marker,
                      'click',
                      function () {
                        // 마커 클릭 시에도 모달을 열도록 수정
                        handleRestaurantClick(restaurant);
                      }
                    );
                    bounds.extend(markerPosition);
                  }
                });

                if (fetchedRestaurants.length > 0) {
                  map.setBounds(bounds);
                }
              } else {
                setError(
                  '음식점 데이터를 가져오지 못했습니다: ' +
                    (response.data ? response.data.message : '알 수 없는 오류')
                );
              }
            })
            .catch((err) => {
              setError('음식점 데이터를 가져오는 중 오류 발생: ' + err.message);
              console.error('음식점 데이터를 가져오는 중 오류 발생:', err);
            });
        });
      };
    }
  }, [activeContent]); // activeContent가 변경될 때마다 useEffect 재실행

  // 메인 콘텐츠 렌더링 함수
  const renderMainContent = () => {
    switch (activeContent) {
      case 'home':
        return (
          <div className="home-container">
            <h1>
              환영합니다,{' '}
              {currentUser
                ? currentUser.userNickname || currentUser.userUsername
                : '게스트'}
              님!
            </h1>
            <p>이곳은 투게더 애플리케이션의 메인 페이지입니다.</p>
            {error && <p className="error-message">오류: {error}</p>}
            <div id="map" className="map-container">
              {!window.kakao && <p>카카오 맵을 로드 중입니다...</p>}
            </div>
            <h2>음식점 목록</h2>
            {restaurants.length > 0 ? (
              <ul className="restaurant-list">
                {restaurants.map((restaurant) => {
                  // 주소 필드들을 조합
                  const fullAddress = `${restaurant.addrSido || ''} ${
                    restaurant.addrSigungu || ''
                  } ${restaurant.addrDong || ''} ${
                    restaurant.addrDetail || ''
                  }`.trim();
                  return (
                    restaurant && (
                      <li
                        key={restaurant.restaurantId}
                        className="restaurant-item"
                        onClick={() => handleRestaurantClick(restaurant)}
                      >
                        {' '}
                        {/* 클릭 이벤트 추가 */}
                        <h3>{restaurant.restaurantName}</h3>
                        <p>주소: {fullAddress}</p> {/* 수정된 주소 필드 */}
                        <p>카테고리: {restaurant.restaurantCategory}</p>
                      </li>
                    )
                  );
                })}
              </ul>
            ) : (
              !error && <p>음식점 데이터를 로드 중입니다...</p>
            )}
          </div>
        );

      // 이달의 여행지 순위 투표 ---------------------------
      case 'pick':
        return <RestaurantVote currentUser={currentUser} />;
      // --------------------------------------------------
      case 'add':
        return (
          <div>
            <h2>새 게시물 추가</h2>
            <p>새로운 맛집 리뷰를 작성해보세요.</p>
          </div>
        );
      case 'mypage':
        return <UserPage currentUser={currentUser} />;
        {
          /* UserPage 컴포넌트 렌더링 및 currentUser 전달 */
        }
      default: // 예외 처리 또는 기본 홈 콘텐츠
        return (
          <div>
            <h2>홈 페이지 콘텐츠</h2>
            <p>환영합니다! 최신 맛집 정보와 피드를 확인하세요.</p>
          </div>
        );
    }
  };

  return (
    // 모든 내용을 감싸는 단일 최상위 div
    <div className="app-layout">
      {/* Sidebar 컴포넌트에 클릭 핸들러 전달 */}
      <Sidebar onMenuItemClick={handleSidebarClick} /> {/* 메인 콘텐츠 영역 */}
      <div className="main-content-area">{renderMainContent()}</div>
      {/* AI 모달 */}
      <AiModal
        isOpen={isAiModalOpen}
        onRequestClose={() => setIsAiModalOpen(false)}
      />
      {/* 음식점 상세 모달 */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          isOpen={isDetailModalOpen}
          onRequestClose={() => setIsDetailModalOpen(false)}
          restaurant={selectedRestaurant}
        />
      )}
    </div>
  );
}

export default Home;
