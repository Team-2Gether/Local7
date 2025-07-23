import React, { useState, useCallback, useEffect, useMemo } from 'react';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import { useRestaurants, useMap, usePagination } from './hooks/useRestaurant';
import './Restaurant.css';

function Restaurant({ currentUser }) {
  const {
    allRestaurants,
    filteredRestaurants, // 검색 및 정렬된 결과 (useRestaurants 훅에서 반환)
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleShowAllRestaurants, // 이 함수는 더 이상 사용되지 않지만, 훅에서 반환되므로 유지
    activeSortBy,
    handleSortClick,
    setFilteredRestaurants: setFilteredRestaurantsForMap, // useMap에 전달할 setFilteredRestaurants 함수
    refetchRestaurants,
  } = useRestaurants();

  // 카테고리 관련 상태
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // 모달 관련 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleRestaurantClick = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedRestaurant(null);
  }, []);

  // useMap 훅 호출 시 handleRestaurantClick 함수를 인자로 전달
  const {
    map,
    mapContainerRef,
    handleMyPositionClick,
    handleFilterClick
  } = useMap(allRestaurants, setFilteredRestaurantsForMap, handleRestaurantClick);

  // 1. 사용 가능한 메인 카테고리 목록 추출
  const availableMainCategories = useMemo(() => {
    const categories = new Set();
    allRestaurants.forEach(restaurant => {
      if (restaurant.restaurantCategory) {
        const parts = restaurant.restaurantCategory.split(' > ');
        if (parts.length > 1) { // '음식점 > 한식' 형식
          categories.add(parts[1]);
        }
      }
    });
    return ['', ...Array.from(categories).sort()]; // 전체 선택 옵션 추가
  }, [allRestaurants]);

  // 2. 선택된 메인 카테고리에 따른 하위 카테고리 목록 추출
  const availableSubCategories = useMemo(() => {
    const subCategories = new Set();
    allRestaurants.forEach(restaurant => {
      if (restaurant.restaurantCategory) {
        const parts = restaurant.restaurantCategory.split(' > ');
        if (selectedMainCategory) {
          if (parts[1] === selectedMainCategory && parts.length > 2) { // '한식 > 해물,생선' 형식
            subCategories.add(parts[2]);
          }
        }
      }
    });
    return ['', ...Array.from(subCategories).sort()]; // 전체 선택 옵션 추가
  }, [selectedMainCategory, allRestaurants]);

  // 3. 카테고리 선택에 따른 필터링 로직
  const categorizedRestaurants = useMemo(() => {
    let currentResults = filteredRestaurants; // useRestaurants 훅의 필터링된 기본 목록

    if (selectedMainCategory) {
      currentResults = currentResults.filter(restaurant =>
        restaurant.restaurantCategory && restaurant.restaurantCategory.includes(` > ${selectedMainCategory}`)
      );
    }
    if (selectedSubCategory) {
      currentResults = currentResults.filter(restaurant =>
        restaurant.restaurantCategory && restaurant.restaurantCategory.includes(` > ${selectedMainCategory} > ${selectedSubCategory}`)
      );
    }
    return currentResults;
  }, [filteredRestaurants, selectedMainCategory, selectedSubCategory]);

  // usePagination 훅에서 필요한 상태와 함수를 가져옵니다.
  const {
    paginatedItems: paginatedRestaurants,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination(categorizedRestaurants, 12);

  // 검색창, 정렬, 카테고리 변경 시 페이지네이션 초기화
  useEffect(() => {
    if (currentPage !== 0) { // 현재 페이지가 0이 아닌 경우에만 초기화
      handlePageChange(0);
    } 
  }, [searchTerm, activeSortBy, selectedMainCategory, selectedSubCategory, handlePageChange]);

  if (loading) {
    return <div className="loading">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <h1>
          환영합니다, {currentUser ? currentUser.userNickname : '게스트'} 님!
          <br></br>LOCAL7의 맛을 찾아보세요
        </h1>

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
          {/* 정렬 버튼과 카테고리 드롭다운을 같은 div로 묶어 일렬 배치 */}
          <div className="controls-group">
            {/* 카테고리 필터링 드롭다운 */}
            <div className="category-filter-container">
                <select
                    value={selectedMainCategory}
                    onChange={(e) => {
                        setSelectedMainCategory(e.target.value);
                        setSelectedSubCategory(''); // 메인 카테고리 변경 시 서브 카테고리 초기화
                    }}
                    className="category-dropdown"
                >
                    <option value="">전체 카테고리</option>
                    {availableMainCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                <select
                    value={selectedSubCategory}
                    onChange={(e) => {
                        setSelectedSubCategory(e.target.value);
                    }}
                    className="category-dropdown"
                    disabled={!selectedMainCategory} // 메인 카테고리 선택 안 하면 비활성화
                >
                    <option value="">하위 카테고리</option>
                    {availableSubCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

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
        </div>

        {paginatedRestaurants.length > 0 ? (
          <ul className="restaurant-list">
            {paginatedRestaurants.map((r) => {
              // 주소 정보가 없는 경우를 대비하여 빈 문자열 처리 추가
              const address = `${r.addrSido || ''} ${r.addrSigungu || ''} ${r.addrDong || ''} ${r.addrDetail || ''}`.trim();
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
          !loading && <p>해당하는 음식점 목록이 없습니다.</p>
        )}

        {/* 페이지네이션 컨트롤 */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className="pagination-button">
            이전
          </button>
          <span>{currentPage + 1} / {totalPages} ({categorizedRestaurants.length}개)</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages} className="pagination-button">
            다음
          </button>
        </div>

        {selectedRestaurant && (
          <RestaurantDetailModal
            isOpen={isDetailModalOpen}
            onRequestClose={handleModalClose}
            restaurant={selectedRestaurant}
            currentUser={currentUser}
            onReviewSubmitted={refetchRestaurants}
          />
        )}
      </div>
    </div>
  );
}

export default Restaurant;