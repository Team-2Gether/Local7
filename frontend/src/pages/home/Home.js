import React, { useEffect, useState } from "react";
import banner1 from "../../assets/images/banner.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";

// 도시 컴포넌트 import
import Seven from "./components/Seven";
import Busan from "./components/Busan";
import Donghae from "./components/Donghae";
import Gangneung from "./components/Gangneung";
import Goseong from "./components/Goseong";
import Gyeongju from "./components/Gyeongju";
import Pohang from "./components/Pohang";
import Samcheok from "./components/Samcheok";
import Sokcho from "./components/Sokcho";
import Uljin from "./components/Uljin";
import Ulsan from "./components/Ulsan";
import Yangyang from "./components/Yangyang";
import Yeongdeok from "./components/Yeongdeok";

import "./Home.css";
import HomeCardFeed from "./HomeCardFeed";

function Home() {
  const [selectedCity, setSelectedCity] = useState("속초");
  const [mapObj, setMapObj] = useState(null);

  // ✅ 배너 슬라이드 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = 3; // 위로 올라갈 div 묶음 개수

  useEffect(() => {
    // ✅ 카카오 지도 로딩
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services";
    script.async = true;

    script.onload = () => {
      const container = document.getElementById("kakao-map");
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.75),
        level: 14,
      };
      const map = new window.kakao.maps.Map(container, options);
      setMapObj(map);

      const cityPoints = [
        {name: "고성",latlng: new window.kakao.maps.LatLng(38.38, 128.4676)},
        {name: "속초",latlng: new window.kakao.maps.LatLng(38.2104, 128.5913)},
        {name: "양양",latlng: new window.kakao.maps.LatLng(38.0768, 128.6199)},
        {name: "강릉",latlng: new window.kakao.maps.LatLng(37.752, 128.8761)},
        {name: "동해",latlng: new window.kakao.maps.LatLng(37.5224, 129.1147)},
        {name: "삼척",latlng: new window.kakao.maps.LatLng(37.4475, 129.1651)},
        {name: "울진",latlng: new window.kakao.maps.LatLng(36.9932, 129.4005)},
        {name: "영덕",latlng: new window.kakao.maps.LatLng(36.3504, 129.3657)},
        {name: "포항",latlng: new window.kakao.maps.LatLng(35.9982, 129.4)},
        {name: "경주",latlng: new window.kakao.maps.LatLng(35.8562, 129.2246)},
        {name: "울산",latlng: new window.kakao.maps.LatLng(35.5396, 129.311)},
        {name: "부산",latlng: new window.kakao.maps.LatLng(35.1796, 129.0756)},
      ];

      const linePath = cityPoints.map((c) => c.latlng);
      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFCC00",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      cityPoints.forEach((city) => {
        const delta = 0.03;
        const polygonPath = [
          new window.kakao.maps.LatLng(city.latlng.getLat() - delta, city.latlng.getLng() - delta),
          new window.kakao.maps.LatLng(city.latlng.getLat() - delta, city.latlng.getLng() + delta),
          new window.kakao.maps.LatLng(city.latlng.getLat() + delta, city.latlng.getLng() + delta),
          new window.kakao.maps.LatLng(city.latlng.getLat() + delta, city.latlng.getLng() - delta),
        ];

        const polygon = new window.kakao.maps.Polygon({
          path: polygonPath,
          strokeWeight: 3,
          strokeColor: "#FF0000",
          strokeOpacity: 0.7,
          strokeStyle: "solid",
          fillOpacity: 0.5,
        });
        polygon.setMap(map);
      });
    };

    document.head.appendChild(script);
  }, []);

  // ✅ 슬라이드 자동 이동
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 마지막 슬라이드 시 순간 이동
  useEffect(() => {
    if (currentSlide === slideCount) {
      const timeout = setTimeout(() => {
        setCurrentSlide(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentSlide]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    if (mapObj) {
      if (city === "전체") {
        mapObj.setCenter(new window.kakao.maps.LatLng(36.5, 127.75));
        mapObj.setLevel(14);
      } else {
        const cityLatLng = {
          고성: [38.38, 128.4676],
          속초: [38.2104, 128.5913],
          양양: [38.0768, 128.6199],
          강릉: [37.752, 128.8761],
          동해: [37.5224, 129.1147],
          삼척: [37.4475, 129.1651],
          울진: [36.9932, 129.4005],
          영덕: [36.3504, 129.3657],
          포항: [35.9982, 129.4],
          경주: [35.8562, 129.2246],
          울산: [35.5396, 129.311],
          부산: [35.1796, 129.0756],
        };
        const [lat, lng] = cityLatLng[city];
        mapObj.setCenter(new window.kakao.maps.LatLng(lat, lng));
        mapObj.setLevel(10);
      }
    }
  };

  return (
    <div className="app-layout">
      <div className="main-content-area">
        <div className="dark-box">

          {/* ✅ 배너 영역 - 기존 가로 배치 유지 */}
          <div className="banner">
            <div
              className={`slides-container-vertical ${currentSlide === slideCount ? 'no-transition' : ''}`}
              style={{ transform: `translateY(-${currentSlide * 105}px)` }}
            >
              <div style={{ display: "flex" }}>
                <img src={banner1} alt="배너1" className="banner-img" />
                <img src={banner2} alt="배너2" className="banner-img" />
              </div>
              <div style={{ display: "flex" }}>
                <img src={banner3} alt="배너3" className="banner-img" />
                <img src={banner4} alt="배너4" className="banner-img" />
              </div>
              <div style={{ display: "flex" }}>
                <img src={banner1} alt="복제1" className="banner-img" />
                <img src={banner2} alt="복제2" className="banner-img" />
              </div>
            </div>
          </div>

          {/* ✅ 지도 + 버튼 + 도시별 컴포넌트 */}
          <div className="map-description-container">
            <div
              id="kakao-map"
              style={{ width: "380px", height: "300px", borderRadius: "100px" }}
            ></div>
            <div className="grid-buttons">
              {["전체","고성","속초","양양","강릉","동해","삼척","울진","영덕","포항","경주","울산","부산"].map((city, idx) => (
                <button
                  key={idx}
                  className={selectedCity === city ? "active" : ""}
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </button>
              ))}
            </div>

            {selectedCity === "전체" && <Seven />}
            {selectedCity === "부산" && <Busan />}
            {selectedCity === "동해" && <Donghae />}
            {selectedCity === "강릉" && <Gangneung />}
            {selectedCity === "고성" && <Goseong />}
            {selectedCity === "경주" && <Gyeongju />}
            {selectedCity === "포항" && <Pohang />}
            {selectedCity === "삼척" && <Samcheok />}
            {selectedCity === "속초" && <Sokcho />}
            {selectedCity === "울진" && <Uljin />}
            {selectedCity === "울산" && <Ulsan />}
            {selectedCity === "양양" && <Yangyang />}
            {selectedCity === "영덕" && <Yeongdeok />}
          </div>

          <hr className="separator" />

          <div className="photo-strip-line">
            <img src="/images/food1.jpg" alt="음식1" />
            <img src="/images/sea1.jpg" alt="바다" />
            <img src="/images/cablecar.jpg" alt="케이블카" />
            <img src="/images/food2.jpg" alt="음식2" />
          </div>

          <hr className="separator" />

          <div className="page-content">
            <HomeCardFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
