import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import RestaurantDetailModal from './RestaurantDetailModal';
import './Main.css';

function Main({ currentUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const updateMapAndList = useCallback((fetchedRestaurants) => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (map.markerList) {
        map.markerList.forEach(marker => marker.setMap(null));
      }

      const bounds = new window.kakao.maps.LatLngBounds();
      const markers = [];

      fetchedRestaurants.forEach((r) => {
        if (r.restaurantLat && r.restaurantLon) {
          const pos = new window.kakao.maps.LatLng(
            parseFloat(r.restaurantLat),
            parseFloat(r.restaurantLon)
          );
          const marker = new window.kakao.maps.Marker({
            map,
            position: pos,
            title: r.restaurantName,
          });
          markers.push(marker);
          bounds.extend(pos);
        }
      });

      if (fetchedRestaurants.length > 0) map.setBounds(bounds);
      map.markerList = markers;
    }
    setRestaurants(fetchedRestaurants);
  }, []);

  const fetchAndRenderRestaurants = useCallback((lat, lon, radius) => {
    axios
      .get(`http://localhost:8080/api/restaurants?lat=${lat}&lon=${lon}&radius=${radius}`)
      .then((response) => {
        if (response.data?.status === 'success') {
          const fetched = response.data.data.filter(Boolean);
          updateMapAndList(fetched);
        } else {
          setError('음식점 데이터를 가져오지 못했습니다.');
        }
      })
      .catch((err) => {
        setError('데이터 가져오기 오류: ' + err.message);
      });
  }, [updateMapAndList]);

  const initializeMapAndLoadData = useCallback(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.8847, 127.7290),
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

    window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lon = latlng.getLng();
      fetchAndRenderRestaurants(lat, lon, 2000);
      map.setCenter(latlng);
    });
  }, [fetchAndRenderRestaurants]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMapAndLoadData();
      fetchAndRenderRestaurants(37.8847, 127.7290, 2000);
    } else {
      const script = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMapAndLoadData();
          fetchAndRenderRestaurants(37.8847, 127.7290, 2000);
        });
      };
    }
  }, [fetchAndRenderRestaurants, initializeMapAndLoadData]);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="home-container1">
      <h1>
        환영합니다, {currentUser ? currentUser.userNickname : '게스트'} 님!
      </h1>
      {error && <p className="error-message">{error}</p>}

      <div id="map" className="map-container" ref={mapContainerRef}></div>

      <h2>음식점 목록</h2>
      {restaurants.length > 0 ? (
        <ul className="restaurant-list">
          {restaurants.map((r) => {
            const address = `${r.addrSido || ''} ${r.addrSigungu || ''} ${r.addrDong || ''} ${r.addrDetail || ''}`;
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

      {selectedRestaurant && (
        <RestaurantDetailModal
          isOpen={isDetailModalOpen}
          onRequestClose={() => setIsDetailModalOpen(false)}
          restaurant={selectedRestaurant}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Main;
