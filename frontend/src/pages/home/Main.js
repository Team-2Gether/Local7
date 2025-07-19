import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import RestaurantDetailModal from './RestaurantDetailModal';
import './Main.css';

function Main({ currentUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSortBy, setActiveSortBy] = useState(null)
  
  const mapContainerRef = useRef(null);
  const myLocationMarkerRef = useRef(null);

  // 동해시청의 위도, 경도
  const DONGHAE_CITY_HALL_LAT = 37.5255;
  const DONGHAE_CITY_HALL_LON = 129.1147;

  // 음식점 항목 클릭 핸들러
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedRestaurant(null);
  };
  
  // 마커를 관리하고 지도에 표시하는 함수
  const updateMapMarkers = useCallback((mapInstance, fetchedRestaurants) => {
    if (!mapInstance) return;

    if (mapInstance.markerList) {
      mapInstance.markerList.forEach(marker => marker.setMap(null));
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
          map: mapInstance,
          position: pos,
          title: r.restaurantName,
        });
        
        window.kakao.maps.event.addListener(marker, 'click', function() {
            handleRestaurantClick(r);
        });

        markers.push(marker);
        bounds.extend(pos);
      }
    });

    if (fetchedRestaurants.length > 0) mapInstance.setBounds(bounds);
    mapInstance.markerList = markers;
  }, [handleRestaurantClick]);

  // 거리를 계산하는 함수 (Haversine 공식)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 반경 필터링 함수
  const handleFilterClick = useCallback((radius, data = restaurants) => {
    const centerLat = DONGHAE_CITY_HALL_LAT;
    const centerLon = DONGHAE_CITY_HALL_LON;

    let mapLevel = 3;
    if (radius <= 1) {
      mapLevel = 4;
    } else if (radius <= 3) {
      mapLevel = 3;
    } else if (radius <= 10) {
      mapLevel = 6;
    } else if (radius <= 15 || radius <= 20) {
      mapLevel = 7;
    }

    if (map) {
      map.setLevel(mapLevel);
      map.panTo(new window.kakao.maps.LatLng(centerLat, centerLon));
    }

    const newFilteredList = data.filter(restaurant => {
      if (restaurant.restaurantLat && restaurant.restaurantLon) {
        const distance = getDistance(centerLat, centerLon, restaurant.restaurantLat, restaurant.restaurantLon);
        return distance <= radius;
      }
      return false;
    });

    setFilteredRestaurants(newFilteredList);
    console.log(`${radius}km 반경 필터링 완료:`, newFilteredList.length, '개');
  }, [restaurants, map, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON]);

  // 평점순 또는 댓글순으로 정렬하는 함수
  const handleSortClick = (sortBy) => {
    const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.averageRating - a.averageRating;
      } else if (sortBy === 'comments') {
        return b.totalComments - a.totalComments;
      }
      return 0;
    });
    setFilteredRestaurants(sortedRestaurants);
    setActiveSortBy(sortBy);
    console.log(`${sortBy} 순으로 정렬 완료`);
  };

  // 모든 음식점 데이터를 가져오는 함수
  const fetchAllRestaurants = useCallback(async (callback) => {
    try {
      const response = await axios.get('http://localhost:8080/api/restaurants');
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setRestaurants(response.data.data);
        if (callback) {
          callback(response.data.data);
        }
      } else {
        console.error('API 응답 형식이 예상과 다릅니다.', response.data);
        setError('음식점 데이터를 가져오지 못했습니다.');
      }
    } catch (err) {
      setError('데이터 가져오기 오류: ' + err.message);
    }
  }, []);

  // 지도 스크립트 로드 useEffect
  useEffect(() => {
    const mapScriptId = "kakao-map-script";
    if (document.getElementById(mapScriptId) || window.kakao) {
        return;
    }
    const script = document.createElement("script");
    script.id = mapScriptId;
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services";
    script.async = true;
    document.head.appendChild(script);

    return () => {
        const script = document.getElementById(mapScriptId);
        if (script) {
            script.remove();
        }
    };
  }, []);

  // 지도 초기화 및 데이터 로드 useEffect
  useEffect(() => {
    const container = mapContainerRef.current;
    if (window.kakao && window.kakao.maps && container && !map) {
      const options = {
          center: new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON),
          level: 3,
      };
      const createdMap = new window.kakao.maps.Map(container, options);
      setMap(createdMap);
      
      fetchAllRestaurants((data) => {
          handleFilterClick(3, data);
      });
    }
  }, [map, mapContainerRef, fetchAllRestaurants, handleFilterClick, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON]);

  // 필터링된 음식점 목록이 변경되면 마커를 업데이트
  useEffect(() => {
    if (map) {
      updateMapMarkers(map, filteredRestaurants);
    }
  }, [map, filteredRestaurants, updateMapMarkers]);

  // '내 위치' 버튼 클릭 핸들러
  const handleMyPositionClick = () => {
    if (map) {
      const donghaePosition = new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON);
      
      map.setLevel(4);
      map.panTo(donghaePosition);

      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null);
      }
      
      const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      const imageSize = new window.kakao.maps.Size(24, 35);
      const imageOption = {
          offset: new window.kakao.maps.Point(12, 35)
      };
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      
      const newMarker = new window.kakao.maps.Marker({
        map: map,
        position: donghaePosition,
        image: markerImage
      });
      
      myLocationMarkerRef.current = newMarker;
    }
  };

  // 검색 기능 핸들러
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // 검색어가 비어있으면 전체 목록 표시
      setFilteredRestaurants(restaurants);
    } else {
      const results = restaurants.filter(restaurant =>
        restaurant.restaurantName.includes(searchTerm.trim())
      );
      setFilteredRestaurants(results);
    }
  };

  // **새로 추가된 함수**
  // 전체 목록 보기 핸들러
  const handleShowAllRestaurants = () => {
    setFilteredRestaurants(restaurants);
  };

  return (
    <div className="home-container1">
      <h1>
        환영합니다, {currentUser ? currentUser.userNickname : '게스트'} 님!
      </h1>
      {error && <p className="error-message">{error}</p>}

      <div id="map_wrap">
        <div id="map" ref={mapContainerRef}></div>
        <div className="custom-controls">
          <button onClick={handleMyPositionClick} className="my-position-btn">내 위치</button>
          <div className="filter-buttons">
            <button onClick={() => handleFilterClick(1)}>1km</button>
            <button onClick={() => handleFilterClick(3)}>3km</button>
            <button onClick={() => handleFilterClick(10)}>10km</button>
            <button onClick={() => handleFilterClick(15)}>15km</button>
          </div>
        </div>
      </div>

      <div className="restaurant-list-header">
        <h2>음식점 목록</h2>
        <div className="sort-buttons1">
            <button
              onClick={() => handleSortClick('rating')}
              className={activeSortBy === 'rating' ? 'active' : ''}
            >
              평점순
            </button>
            <button
              onClick={() => handleSortClick('comments')}
              className={activeSortBy === 'comments' ? 'active' : ''}
            >
              댓글순
            </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="음식점 이름을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>검색</button>
        <button onClick={handleShowAllRestaurants}>전체보기</button>
      </div>
      
      {filteredRestaurants.length > 0 ? (
        <ul className="restaurant-list">
          {filteredRestaurants.map((r) => {
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
          onRequestClose={handleModalClose}
          restaurant={selectedRestaurant}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default Main;