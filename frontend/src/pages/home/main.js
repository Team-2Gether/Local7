import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar';
import AiModal from '../ai/components/AiModal';
import UserPage from '../user/UserPage';
import RestaurantDetailModal from './RestaurantDetailModal';
import RestaurantVote from '../restaurant/RestaurantVote';
import PostList from '../post/components/PostList';
import PostForm from '../post/PostForm';

import './Home.css';

function Main({ currentUser }) {
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);

    const location = useLocation(); 
    const navigate = useNavigate(); 

    // 사이드바 및 AI 모달 관련 상태
    const [activeContent, setActiveContent] = useState('home');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    // 음식점 상세 모달 관련 상태
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        if (location.pathname === '/posts') {
            setActiveContent('posts');
        } else if (location.pathname.startsWith('/posts/new')) {
            setActiveContent('add');
        } else if (location.pathname.startsWith('/posts/edit/')) {
            setActiveContent('edit'); 
        } else if (location.pathname === '/mypage') {
            setActiveContent('mypage');
        } else if (location.pathname === '/pick') {
            setActiveContent('pick');
        }
        else {
            setActiveContent('home');
        }
    }, [location.pathname]);


    // 사이드바 메뉴 클릭 핸들러
    const handleSidebarClick = (item) => {
        if (item === 'ai') {
            setIsAiModalOpen(true);
        } else {
            setActiveContent(item);
            setIsAiModalOpen(false);

            // 사이드바 클릭에 따라 경로도 변경
            if (item === 'home') navigate('/');
            else if (item === 'posts') navigate('/posts');
            else if (item === 'add') navigate('/posts/new');
            else if (item === 'mypage') navigate('/mypage');
            else if (item === 'pick') navigate('/pick');
        }
    };

    // 음식점 클릭 핸들러 (상세 모달 열기)
    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsDetailModalOpen(true);
    };

    useEffect(() => {
        if (activeContent === 'home') {
            const script = document.createElement('script');
            script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services';
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
                                .LatLng(37.5665, 126.978),
                            level: 3
                        };
                        const map = new window
                            .kakao
                            .maps
                            .Map(container, options);

                        const getCurrentLocation = () => {
                            if (navigator.geolocation) {
                                navigator
                                    .geolocation
                                    .getCurrentPosition((position) => {
                                        const lat = position.coords.latitude;
                                        const lon = position.coords.longitude;
                                        const locPosition = new window
                                            .kakao
                                            .maps
                                            .LatLng(lat, lon);
                                        map.setCenter(locPosition);

                                        new window
                                            .kakao
                                            .maps
                                            .Marker({map: map, position: locPosition, title: '현재 위치'});
                                    }, (err) => {
                                        console.error('Geolocation 에러 발생:', err);
                                        alert('현재 위치를 가져올 수 없습니다. 설정된 기본 위치로 지도를 로드합니다.');
                                    }, {
                                        enableHighAccuracy: true,
                                        maximumAge: 0,
                                        timeout: 5000
                                    });
                            } else {
                                alert('이 브라우저에서는 Geolocation을 지원하지 않습니다. 설정된 기본 위치로 지도를 로드합니다.');
                            }
                        };

                        getCurrentLocation();

                        axios
                            .get('http://localhost:8080/api/restaurants')
                            .then((response) => {
                                if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
                                    const fetchedRestaurants = response
                                        .data
                                        .data
                                        .filter((restaurant) => restaurant != null);
                                    setRestaurants(fetchedRestaurants);

                                    const bounds = new window
                                        .kakao
                                        .maps
                                        .LatLngBounds();
                                    fetchedRestaurants.forEach((restaurant) => {
                                        if (restaurant.restaurantLat && restaurant.restaurantLon) {
                                            const markerPosition = new window
                                                .kakao
                                                .maps
                                                .LatLng(parseFloat(restaurant.restaurantLat),
                                                    parseFloat(restaurant.restaurantLon)
                                                );
                                            const marker = new window
                                                .kakao
                                                .maps
                                                .Marker({map: map, position: markerPosition, title: restaurant.restaurantName});

                                            window
                                                .kakao
                                                .maps
                                                .event
                                                .addListener(marker, 'click', function () {
                                                    handleRestaurantClick(restaurant);
                                                });
                                            bounds.extend(markerPosition);
                                        }
                                    });

                                    if (fetchedRestaurants.length > 0) {
                                        map.setBounds(bounds);
                                    }
                                } else {
                                    setError('음식점 데이터를 가져오지 못했습니다: ' + (
                                        response.data
                                            ? response.data.message
                                            : '알 수 없는 오류'
                                    ));
                                }
                            })
                            .catch((err) => {
                                setError('음식점 데이터를 가져오는 중 오류 발생: ' + err.message);
                                console.error('음식점 데이터를 가져오는 중 오류 발생:', err);
                            });
                    });
            };
        }
    }, [activeContent]);

    // 메인 콘텐츠 렌더링 함수
    const renderMainContent = () => {
        switch (activeContent) {
            case 'home':
                return (
                    <div className="home-container">
                        <h1>
                            환영합니다,{' '}
                            {
                                currentUser
                                    ? currentUser.userNickname || currentUser.userUsername
                                    : '게스트'
                            }
                            님!
                        </h1>
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
                                            restaurants.map((restaurant) => {
                                                const fullAddress = `${restaurant.addrSido || ''} ${
                                                    restaurant.addrSigungu || ''} ${restaurant.addrDong || ''} ${
                                                    restaurant.addrDetail || ''}`.trim();
                                                return (restaurant && (
                                                    <li
                                                        key={restaurant.restaurantId}
                                                        className="restaurant-item"
                                                        onClick={() => handleRestaurantClick(restaurant)}>
                                                        <h3>{restaurant.restaurantName}</h3>
                                                        <p>주소: {fullAddress}</p>
                                                        <p>카테고리: {restaurant.restaurantCategory}</p>
                                                    </li>
                                                ));
                                            })
                                        }
                                    </ul>
                                )
                                : (!error && <p>음식점 데이터를 로드 중입니다...</p>)
                        }
                    </div>
                );

            case 'posts':
                return <PostList />;

            case 'add':
                return <PostForm />;

            case 'edit': 
                return <PostForm />;

            case 'pick':
                return <RestaurantVote currentUser={currentUser}/>;

            case 'mypage':
                return <UserPage currentUser={currentUser}/>;

            default:
                return (
                    <div>
                        <h2>홈 페이지 콘텐츠</h2>
                        <p>환영합니다! 최신 맛집 정보와 피드를 확인하세요.</p>
                    </div>
                );
        }
    };

    return (
        <div className="app-layout">
            <Sidebar onMenuItemClick={handleSidebarClick}/>
            <div className="main-content-area">
                {/* Main 컴포넌트 내부에서 라우팅 처리 */}
                <Routes>
                    <Route path="/" element={renderMainContent()} />
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/posts/new" element={<PostForm />} />
                    <Route path="/posts/edit/:id" element={<PostForm />} />
                    <Route path="/mypage" element={<UserPage currentUser={currentUser}/>} />
                    <Route path="/pick" element={<RestaurantVote currentUser={currentUser}/>} />
                </Routes>
            </div>
            <AiModal isOpen={isAiModalOpen} onRequestClose={() => setIsAiModalOpen(false)}/>
            {
                selectedRestaurant && (
                    <RestaurantDetailModal
                        isOpen={isDetailModalOpen}
                        onRequestClose={() => setIsDetailModalOpen(false)}
                        restaurant={selectedRestaurant}/>
                )
            }
        </div>
    );
}

export default Main;