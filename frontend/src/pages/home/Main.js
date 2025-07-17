import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import RestaurantDetailModal from './RestaurantDetailModal';
import './Home.css';

function Main({ currentUser }) { // activeContent prop 제거
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // 지도에 마커를 추가하고, 목록을 업데이트하는 함수
  const updateMapAndList = (fetchedRestaurants) => {
    // 기존 마커 제거
    if (mapInstanceRef.current) {
        const map = mapInstanceRef.current;
        if (map.markerList) { // 이전에 저장된 마커 리스트가 있다면 모두 제거
            map.markerList.forEach(marker => marker.setMap(null));
        }
    }

    const map = mapInstanceRef.current;
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
    setRestaurants(fetchedRestaurants);
    map.markerList = markers; // 새로운 마커 리스트를 지도 객체에 저장
  };

  // 백엔드 API에서 특정 위치 주변의 음식점을 가져와서 지도에 렌더링하는 함수
  const fetchAndRenderRestaurants = (lat, lon, radius) => {
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
  };

  const initializeMapAndLoadData = () => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }

    const options = {
      // 초기 지도를 강원도 시청 위치로 설정
      center: new window.kakao.maps.LatLng(37.8847, 127.7290),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;

    // 현재 위치를 표시하는 기능은 그대로 유지
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

    // 지도 클릭 시 마커 표시 및 검색 기능 추가 (선택 사항)
    window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lon = latlng.getLng();
      fetchAndRenderRestaurants(lat, lon, 2000); // 클릭한 위치 반경 2km 검색
      map.setCenter(latlng);
    });
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMapAndLoadData();
      // 컴포넌트 마운트 시 강원도 시청 주변 음식점을 조회
      fetchAndRenderRestaurants(37.8847, 127.7290, 2000);
    } else {
      const script = document.createElement('script');
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMapAndLoadData();
          fetchAndRenderRestaurants(37.8847, 127.7290, 2000);
        });
      };
    }
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  return (
    // Main 컴포넌트는 이제 Home 컴포넌트의 역할만 수행하거나,
    // /restaurants 경로에 대한 내용을 직접 렌더링하도록 변경됩니다.
    // 여기서는 기존 /restaurants 경로의 내용을 렌더링하도록 유지합니다.
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