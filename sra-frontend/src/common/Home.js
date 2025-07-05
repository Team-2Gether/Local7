import React, { useEffect } from 'react';

function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services"; // Replace YOUR_APP_KEY with your actual Kakao Maps API Key
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default center (e.g., Jeju Island)
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
      });
    };
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>환영합니다!</h1>
      <p>이곳은 투게더 애플리케이션의 메인 페이지입니다.</p>
      <div id="map" style={{ width: '800px', height: '600px', margin: '20px auto' }}></div>
    </div>
  );
}

export default Home;