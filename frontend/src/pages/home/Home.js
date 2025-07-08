// src/pages/home/Home.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar'; // Sidebar 컴포넌트 임포트
import AiModal from '../ai/components/AiModal'; // AiModal 임포트 (경로 확인해주세요)
import UserPage from '../user/UserPage'; // UserPage 임포트 추가
import './Home.css'; // Home.css 임포트 추가

// Home 컴포넌트는 currentUser prop을 받습니다.
function Home({currentUser}) {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);

    // 사이드바 및 AI 모달 관련 상태
    const [activeContent, setActiveContent] = useState('home'); // 현재 활성화된 콘텐츠 (home, add, mypage, ai)
    const [isAiModalOpen, setIsAiModalOpen] = useState(false); // AI 모달 열림/닫힘 상태

    // 사이드바 메뉴 클릭 핸들러
    const handleSidebarClick = (item) => {
        if (item === 'ai') {
            setIsAiModalOpen(true); // AI 버튼 클릭 시 모달 열기
        } else {
            setActiveContent(item); // 다른 버튼 클릭 시 콘텐츠 변경
            setIsAiModalOpen(false); // 혹시 열려있을 AI 모달 닫기
        }
    };

    // Kakao Map 로드 및 음식점 데이터 가져오기 (Home 콘텐츠에만 로드되도록)
    useEffect(() => {
        // activeContent가 'home'일 때만 지도를 로드하고 데이터를 가져옵니다.
        if (activeContent === 'home') {
            const script = document.createElement('script');
            // Kakao Maps API Key를 올바르게 입력해주세요.
            script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services";
            script.async = true;
            document
                .head
                .appendChild(script);

            script.onload = () => {
                window
                    .kakao
                    .maps
                    .load(() => {
                        const container = document.getElementById('map');
                        if (!container) {
                            console.warn(
                                "Kakao map container 'map' not found. Skipping map initialization."
                            );
                            return;
                        }
                        const options = {
                            center: new window
                                .kakao
                                .maps
                                .LatLng(33.450701, 126.570667), // 기본 중심 (제주도)
                            level: 3
                        };
                        const map = new window
                            .kakao
                            .maps
                            .Map(container, options);

                        axios
                            .get('http://localhost:8080/api/restaurants')
                            .then(response => {
                                if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
                                    const fetchedRestaurants = response
                                        .data
                                        .data
                                        .filter(restaurant => restaurant != null);
                                    setRestaurants(fetchedRestaurants);

                                    const bounds = new window
                                        .kakao
                                        .maps
                                        .LatLngBounds();
                                    fetchedRestaurants.forEach(restaurant => {
                                        if (restaurant.restaurantLatitude && restaurant.restaurantLongitude) {
                                            const markerPosition = new window
                                                .kakao
                                                .maps
                                                .LatLng(
                                                    parseFloat(restaurant.restaurantLatitude),
                                                    parseFloat(restaurant.restaurantLongitude)
                                                );
                                            const marker = new window
                                                .kakao
                                                .maps
                                                .Marker({map: map, position: markerPosition, title: restaurant.restaurantName});

                                            const infowindow = new window
                                                .kakao
                                                .maps
                                                .InfoWindow(
                                                    {content: `<div style="padding:5px;font-size:12px;">${restaurant.restaurantName}<br/>${restaurant.restaurantAddress}</div>`}
                                                );

                                            window
                                                .kakao
                                                .maps
                                                .event
                                                .addListener(marker, 'click', function () {
                                                    infowindow.open(map, marker);
                                                });
                                            bounds.extend(markerPosition);
                                        }
                                    });

                                    if (fetchedRestaurants.length > 0) {
                                        map.setBounds(bounds);
                                    }
                                } else {
                                    setError("음식점 데이터를 가져오지 못했습니다: " + (
                                        response.data
                                            ? response.data.message
                                            : "알 수 없는 오류"
                                    ));
                                }
                            })
                            .catch(err => {
                                setError("음식점 데이터를 가져오는 중 오류 발생: " + err.message);
                                console.error("음식점 데이터를 가져오는 중 오류 발생:", err);
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
                        <h1>환영합니다, {
                                currentUser
                                    ? (currentUser.userNickname || currentUser.userUsername)
                                    : '게스트'
                            }님!</h1>
                        <p>이곳은 투게더 애플리케이션의 메인 페이지입니다.</p>
                        {error && <p className="error-message">오류: {error}</p>}
                        <div id="map" className="map-container">
                            {!window.kakao && <p>카카오 맵을 로드 중입니다...</p>}
                        </div>
                        <h2>음식점 목록</h2>
                        {
                            restaurants.length > 0
                                ? (
                                    <ul className="restaurant-list">
                                        {
                                            restaurants.map(restaurant => (restaurant && (
                                                <li key={restaurant.restaurantId} className="restaurant-item">
                                                    <h3>{restaurant.restaurantName}</h3>
                                                    <p>주소: {restaurant.restaurantAddress}</p>
                                                    <p>카테고리: {restaurant.restaurantCategory}</p>
                                                </li>
                                            )))
                                        }
                                    </ul>
                                )
                                : (!error && <p>음식점 데이터를 로드 중입니다...</p>)
                        }
                    </div>
                );
            case 'add':
                return <div>
                    <h2>새 게시물 추가</h2>
                    <p>새로운 맛집 리뷰를 작성해보세요.</p>
                </div>;
            case 'mypage':
                return <UserPage currentUser={currentUser} />; {/* UserPage 컴포넌트 렌더링 및 currentUser 전달 */}
            default: // 예외 처리 또는 기본 홈 콘텐츠
                return <div>
                    <h2>홈 페이지 콘텐츠</h2>
                    <p>환영합니다! 최신 맛집 정보와 피드를 확인하세요.</p>
                </div>;
        }
    };

    return (
        // 모든 내용을 감싸는 단일 최상위 div
        <div className="app-layout">
            {/* Sidebar 컴포넌트에 클릭 핸들러 전달 */}
            <Sidebar onMenuItemClick={handleSidebarClick}/> {/* 메인 콘텐츠 영역 */}
            <div className="main-content-area">
                {renderMainContent()}
            </div>

            {/* AI 모달 */}
            <AiModal isOpen={isAiModalOpen} onRequestClose={() => setIsAiModalOpen(false)}/>
        </div>
    );
}

export default Home;