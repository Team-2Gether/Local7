import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Load Kakao Maps Script
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services"; // Replace YOUR_APP_KEY
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default center (Jeju Island)
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 2. Fetch Restaurant Data
        axios.get('http://localhost:8080/api/restaurants') // Replace with your backend URL if different
          .then(response => {
            if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) { // Ensure data is an array
              const fetchedRestaurants = response.data.data.filter(restaurant => restaurant != null); // Filter out null/undefined
              setRestaurants(fetchedRestaurants);
              // 3. Add Markers to the Map
              fetchedRestaurants.forEach(restaurant => { // Use the filtered list here
                if (restaurant.restaurantLatitude && restaurant.restaurantLongitude) {
                  const markerPosition = new window.kakao.maps.LatLng(
                    parseFloat(restaurant.restaurantLatitude),
                    parseFloat(restaurant.restaurantLongitude)
                  );

                  const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: markerPosition,
                    title: restaurant.restaurantName // Display restaurant name on hover
                  });

                  // Add an info window (optional)
                  const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;">${restaurant.restaurantName}<br/>${restaurant.restaurantAddress}</div>`
                  });

                  window.kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                  });
                }
              });

              // Optional: Adjust map bounds to fit all markers
              if (fetchedRestaurants.length > 0) { // Use the filtered list here
                const bounds = new window.kakao.maps.LatLngBounds();
                fetchedRestaurants.forEach(restaurant => { // Use the filtered list here
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
              setError("Failed to fetch restaurant data: " + (response.data ? response.data.message : "Unknown error"));
            }
          })
          .catch(err => {
            setError("Error fetching restaurant data: " + err.message);
            console.error("Error fetching restaurant data:", err);
          });
      });
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>환영합니다!</h1>
      <p>이곳은 투게더 애플리케이션의 메인 페이지입니다.</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div id="map" style={{ width: '800px', height: '600px', margin: '20px auto' }}></div>
      <h2>음식점 목록</h2>
      {restaurants.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {restaurants.map(restaurant => (
            // Add a check here as well, though filtering above should handle it
            restaurant && (
              <li key={restaurant.restaurantId} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{restaurant.restaurantName}</h3>
                <p>주소: {restaurant.restaurantAddress}</p>
                <p>카테고리: {restaurant.restaurantCategory}</p>
                {/* Add more restaurant details here as needed */}
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

// 690813b8710fce175e3acf9121422624