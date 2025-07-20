import React, { useState, useCallback } from 'react';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import { useRestaurants, useMap, usePagination } from './hooks/useRestaurantHooks';
import './Restaurant.css';

function Restaurant({ currentUser }) {
  const { 
    allRestaurants, 
    filteredRestaurants, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    handleSearch, 
    handleShowAllRestaurants,
    activeSortBy,
    handleSortClick,
    setFilteredRestaurants,
    refetchRestaurants,
  } = useRestaurants();

  // 모달 관련 상태
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleRestaurantClick = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
    refetchRestaurants();
  }, [refetchRestaurants]);

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
  } = useMap(allRestaurants, setFilteredRestaurants, handleRestaurantClick);
  
  const {
    paginatedItems: paginatedRestaurants,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination(filteredRestaurants, 12);

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <h1>
          환영합니다, {currentUser ? currentUser.userNickname : '게스트'} 님!
          <br></br>LOCAL7의 맛을 찾아보세요
        </h1>
        {loading && <p>데이터를 불러오는 중입니다...</p>}
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
          !loading && <p>해당하는 음식점 목록이 없습니다.</p>
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
            onReviewSubmitted={refetchRestaurants}
          />
        )}
      </div>
    </div>
  );
}

export default Restaurant;