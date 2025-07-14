// src/pages/Main.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import RestaurantDetailModal from './RestaurantDetailModal';
import RestaurantVote from '../vote/VotePage';
import Home from './Home';
import PostList from '../post/components/PostList';
import PostForm from '../post/PostForm';
import MyPage from '../user/MyPage';

import './Home.css';

function Main({ currentUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMapAndLoadData();
    } else {
      const script = document.createElement('script');
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMapAndLoadData();
        });
      };
    }
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  const initializeMapAndLoadData = () => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locPosition = new window.kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        map.setCenter(locPosition);
        new window.kakao.maps.Marker({
          map,
          position: locPosition,
          title: '현재 위치',
        });
      });
    }

    axios
      .get('http://localhost:8080/api/restaurants')
      .then((response) => {
        if (response.data?.status === 'success') {
          const fetched = response.data.data.filter(Boolean);
          setRestaurants(fetched);

          const bounds = new window.kakao.maps.LatLngBounds();
          fetched.forEach((r) => {
            if (r.restaurantLat && r.restaurantLon) {
              const pos = new window.kakao.maps.LatLng(
                parseFloat(r.restaurantLat),
                parseFloat(r.restaurantLon)
              );
              new window.kakao.maps.Marker({
                map,
                position: pos,
                title: r.restaurantName,
              });
              bounds.extend(pos);
            }
          });

          if (fetched.length > 0) map.setBounds(bounds);
        } else {
          setError('음식점 데이터를 가져오지 못했습니다.');
        }
      })
      .catch((err) => {
        setError('데이터 가져오기 오류: ' + err.message);
      });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route
          path="/restaurants"
          element={
            <div className="home-container">
              <h1>
                환영합니다, {currentUser ? currentUser.userNickname : '게스트'}{' '}
                님!
              </h1>
              {error && <p className="error-message">{error}</p>}

              <div
                id="map"
                className="map-container"
                ref={mapContainerRef}
              ></div>

              <h2>음식점 목록</h2>
              {restaurants.length > 0 ? (
                <ul className="restaurant-list">
                  {restaurants.map((r) => {
                    const address = `${r.addrSido || ''} ${
                      r.addrSigungu || ''
                    } ${r.addrDong || ''} ${r.addrDetail || ''}`;
                    return (
                      <li
                        key={r.restaurantId}
                        className="restaurant-item"
                        onClick={() => handleRestaurantClick(r)}
                      >
                        <h3>{r.restaurantName}</h3>
                        <p>주소: {address}</p>
                        <p>카테고리: {r.restaurantCategory}</p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                !error && <p>데이터 로딩 중...</p>
              )}
            </div>
          }
        />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />
        <Route path="/mypage" element={<MyPage currentUser={currentUser} />} />
        <Route
          path="/pick"
          element={<RestaurantVote currentUser={currentUser} />}
        />
      </Routes>

      {selectedRestaurant && (
        <RestaurantDetailModal
          isOpen={isDetailModalOpen}
          onRequestClose={() => setIsDetailModalOpen(false)}
          restaurant={selectedRestaurant}
        />
      )}
    </>
  );
}

export default Main;
