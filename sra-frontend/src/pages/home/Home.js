import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Home 컴포넌트는 currentUser prop을 받습니다.
function Home({ currentUser }) { // currentUser prop 추가
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Kakao Maps Script 로드
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services"; // YOUR_APP_KEY를 실제 키로 교체
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 (제주도)
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 2. 음식점 데이터 가져오기
        axios.get('http://localhost:8080/api/restaurants') // 백엔드 URL 확인
          .then(response => {
            if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
              const fetchedRestaurants = response.data.data.filter(restaurant => restaurant != null);
              setRestaurants(fetchedRestaurants);
              // 3. 지도에 마커 추가
              fetchedRestaurants.forEach(restaurant => {
                if (restaurant.restaurantLatitude && restaurant.restaurantLongitude) {
                  const markerPosition = new window.kakao.maps.LatLng(
                    parseFloat(restaurant.restaurantLatitude),
                    parseFloat(restaurant.restaurantLongitude)
                  );

                  const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: markerPosition,
                    title: restaurant.restaurantName
                  });

                  const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;">${restaurant.restaurantName}<br/>${restaurant.restaurantAddress}</div>`
                  });

                  window.kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                  });
                }
              });

              if (fetchedRestaurants.length > 0) {
                const bounds = new window.kakao.maps.LatLngBounds();
                fetchedRestaurants.forEach(restaurant => {
                  if (restaurant.restaurantLatitude && restaurant.restaurantLongitude) {
                    bounds.extend(new window.kakao.maps.LatLng(
                      parseFloat(restaurant.restaurantLatitude),
                      parseFloat(restaurant.restaurantLongitude)
                    ));
                  }
                });
                map.setBounds(bounds);
              }

            } else {
              setError("음식점 데이터를 가져오지 못했습니다: " + (response.data ? response.data.message : "알 수 없는 오류"));
            }
          })
          .catch(err => {
            setError("음식점 데이터를 가져오는 중 오류 발생: " + err.message);
            console.error("음식점 데이터를 가져오는 중 오류 발생:", err);
          });
      });
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* currentUser prop을 사용하여 사용자 이름 표시 */}
      <h1>환영합니다, {currentUser ? (currentUser.userNickname || currentUser.userUsername) : '게스트'}님!</h1>
      <p>이곳은 투게더 애플리케이션의 메인 페이지입니다.</p>
      {error && <p style={{ color: 'red' }}>오류: {error}</p>}
      <div id="map" style={{ width: '800px', height: '600px', margin: '20px auto' }}></div>
      <h2>음식점 목록</h2>
      {restaurants.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {restaurants.map(restaurant => (
            restaurant && (
              <li key={restaurant.restaurantId} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{restaurant.restaurantName}</h3>
                <p>주소: {restaurant.restaurantAddress}</p>
                <p>카테고리: {restaurant.restaurantCategory}</p>
              </li>
            )
          ))}
        </ul>
      ) : (
        !error && <p>음식점 데이터를 로드 중입니다...</p>
      )}
    </div>
  );
}

export default Home;