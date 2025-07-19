import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import RestaurantDetailModal from './RestaurantDetailModal';
import './Restaurant.css';

function Main({ currentUser }) {
  // 모든 음식점 데이터를 저장하는 상태 (지도, 검색, 필터링용)
  const [allRestaurants, setAllRestaurants] = useState([]);
  // 필터링/정렬/검색 결과로 렌더링에 사용될 최종 목록
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSortBy, setActiveSortBy] = useState(null);

  // Pagination 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12; // 페이지당 항목 수

  const mapContainerRef = useRef(null);
  const myLocationMarkerRef = useRef(null);

  const DONGHAE_CITY_HALL_LAT = 37.5255;
  const DONGHAE_CITY_HALL_LON = 129.1147;

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedRestaurant(null);
  };

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
  }, []);

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

  // 필터링 함수를 전체 데이터(allRestaurants) 기준으로 실행
  const handleFilterClick = useCallback((radius) => {
    const centerLat = DONGHAE_CITY_HALL_LAT;
    const centerLon = DONGHAE_CITY_HALL_LON;

    let mapLevel = 3;
    if (radius <= 1) {
      mapLevel = 3;
    } else if (radius <= 3) {
      mapLevel = 4;
    } else if (radius <= 10) {
      mapLevel = 6;
    } else if (radius <= 15 || radius <= 20) {
      mapLevel = 9;
    }

    if (map) {
      map.setLevel(mapLevel);
      map.panTo(new window.kakao.maps.LatLng(centerLat, centerLon));
    }

    const newFilteredList = allRestaurants.filter(restaurant => {
      if (restaurant.restaurantLat && restaurant.restaurantLon) {
        const distance = getDistance(centerLat, centerLon, restaurant.restaurantLat, restaurant.restaurantLon);
        return distance <= radius;
      }
      return false;
    });

    setFilteredRestaurants(newFilteredList);
    setCurrentPage(0); // 필터링 시 첫 페이지로 이동
    console.log(`${radius}km 반경 필터링 완료:`, newFilteredList.length, '개');
  }, [allRestaurants, map, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON]);

  // 정렬 함수를 현재 표시된 필터링된 목록 기준으로 실행
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

  // 전체 음식점 데이터를 가져오는 함수 (지도/필터링용)
  const fetchAllRestaurantsForMap = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/restaurants/all');
      if (response.data?.status === 'success' && response.data.data) {
        setAllRestaurants(response.data.data);
        setFilteredRestaurants(response.data.data); // 초기 목록을 전체 데이터로 설정
      } else {
        console.error('지도 데이터 API 응답 형식이 예상과 다릅니다.', response.data);
        setError('지도 데이터를 가져오지 못했습니다.');
      }
    } catch (err) {
      setError('지도 데이터 가져오기 오류: ' + err.message);
    }
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredRestaurants(allRestaurants);
    } else {
      const results = allRestaurants.filter(restaurant =>
        restaurant.restaurantName.includes(searchTerm.trim())
      );
      setFilteredRestaurants(results);
    }
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleShowAllRestaurants = () => {
    setFilteredRestaurants(allRestaurants);
    setCurrentPage(0); // 전체보기 시 첫 페이지로 이동
  };

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

      // 지도 현재 화면에 보이는 음식점만 필터링하여 목록에 표시
      const bounds = map.getBounds();
      const visibleRestaurants = allRestaurants.filter(r => {
        if (r.restaurantLat && r.restaurantLon) {
          const pos = new window.kakao.maps.LatLng(parseFloat(r.restaurantLat), parseFloat(r.restaurantLon));
          return bounds.contain(pos);
        }
        return false;
      });
      setFilteredRestaurants(visibleRestaurants);
      setCurrentPage(0); // 필터링 시 첫 페이지로 이동
    }
  };

  // 지도 초기화 및 전체 데이터 로딩
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
  
  useEffect(() => {
    const container = mapContainerRef.current;
    if (window.kakao && window.kakao.maps && container && !map) {
      const options = {
          center: new window.kakao.maps.LatLng(DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON),
          level: 3,
      };
      const createdMap = new window.kakao.maps.Map(container, options);
      setMap(createdMap);
      
      // '내 위치' 마커 이벤트 리스너 추가
      window.kakao.maps.event.addListener(createdMap, 'idle', function() {
        const bounds = createdMap.getBounds();
        const visibleRestaurants = allRestaurants.filter(r => {
          if (r.restaurantLat && r.restaurantLon) {
            const pos = new window.kakao.maps.LatLng(parseFloat(r.restaurantLat), parseFloat(r.restaurantLon));
            return bounds.contain(pos);
          }
          return false;
        });
        setFilteredRestaurants(visibleRestaurants);
      });
      
      fetchAllRestaurantsForMap(); // 지도용 전체 데이터 호출
    }
  }, [map, allRestaurants, fetchAllRestaurantsForMap, DONGHAE_CITY_HALL_LAT, DONGHAE_CITY_HALL_LON]);

  // 지도 마커 업데이트는 전체 데이터에 맞춰서
  useEffect(() => {
    if (map && allRestaurants.length > 0) {
      updateMapMarkers(map, allRestaurants);
    }
  }, [map, allRestaurants]);
  
  // 페이징 처리된 목록을 계산하는 useMemo
  const paginatedRestaurants = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return filteredRestaurants.slice(start, end);
  }, [filteredRestaurants, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRestaurants.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
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
              <button onClick={() => handleFilterClick(20)}>20km</button>
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
        
        {paginatedRestaurants.length > 0 ? (
          <ul className="restaurant-list">
            {paginatedRestaurants.map((r) => {
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
                  <p>평점: {r.averageRating ? r.averageRating.toFixed(1) : '평점 없음'}</p>
                  <p>댓글: {r.totalComments !== undefined ? r.totalComments : 0}개</p>
                </li>
              );
            })}
          </ul>
        ) : (
          !error && <p>데이터 로딩 중...</p>
        )}

        {/* 페이지네이션 컨트롤 */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
            이전
          </button>
          <span>{currentPage + 1} / {totalPages} ({filteredRestaurants.length}개)</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
            다음
          </button>
        </div>

        {selectedRestaurant && (
          <RestaurantDetailModal
            isOpen={isDetailModalOpen}
            onRequestClose={handleModalClose}
            restaurant={selectedRestaurant}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default Main;