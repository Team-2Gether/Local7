import React, { useEffect, useState } from "react";
// 배너 이미지 임포트
import banner1 from "../../assets/images/banner.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";

// 각 도시별 소개글 컴포넌트 임포트
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

import "./Home.css"; // 스타일 시트 임포트
import HomeCardFeed from "./HomeCardFeed"; // 음식점 카드 리스트 컴포넌트
import PostList from "../post/components/PostList"; // 게시글 리스트 컴포넌트

function Home() {
  // 선택된 도시 상태 (기본값: '속초')
  const [selectedCity, setSelectedCity] = useState("속초");
  // 카카오 지도 객체를 상태로 저장
  const [mapObj, setMapObj] = useState(null);
  // 현재 활성화된 섹션 상태: 음식점(restaurants) 또는 스레드(posts)
  const [activeSection, setActiveSection] = useState("restaurants");
  // 배너 슬라이드 인덱스 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  // 슬라이드 개수 설정 (0~3까지 총 4개 중 3개를 기준으로 순환)
  const slideCount = 3;

  useEffect(() => {
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

      // 도시 좌표 및 이름 배열
      const cityPoints = [
        { name: "고성", latlng: new window.kakao.maps.LatLng(38.38, 128.4676) },
        { name: "속초", latlng: new window.kakao.maps.LatLng(38.2104, 128.5913) },
        { name: "양양", latlng: new window.kakao.maps.LatLng(38.0768, 128.6199) },
        { name: "강릉", latlng: new window.kakao.maps.LatLng(37.752, 128.8761) },
        { name: "동해", latlng: new window.kakao.maps.LatLng(37.5224, 129.1147) },
        { name: "삼척", latlng: new window.kakao.maps.LatLng(37.4475, 129.1651) },
        { name: "울진", latlng: new window.kakao.maps.LatLng(36.9932, 129.4005) },
        { name: "영덕", latlng: new window.kakao.maps.LatLng(36.3504, 129.3657) },
        { name: "포항", latlng: new window.kakao.maps.LatLng(35.9982, 129.4) },
        { name: "경주", latlng: new window.kakao.maps.LatLng(35.8562, 129.2246) },
        { name: "울산", latlng: new window.kakao.maps.LatLng(35.5396, 129.311) },
        { name: "부산", latlng: new window.kakao.maps.LatLng(35.1796, 129.0756) },
      ];

      // 도시 좌표들을 잇는 노란색 폴리라인
      const linePath = cityPoints.map((c) => c.latlng);
      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFCC00",
        strokeOpacity: 0.8,
      });
      polyline.setMap(map);

      // 원형 폴리곤(Circle) 및 도시명 오버레이 추가
      cityPoints.forEach((city) => {
        // 원형 폴리곤 (반경 1000m)
        const circle = new window.kakao.maps.Circle({
          center: city.latlng,
          radius: 1000, // 미터 단위
          strokeWeight: 3,
          strokeColor: "#ff6a6aff",
          strokeOpacity: 0.7,
          fillColor: "#ff6a6aff",
          fillOpacity: 0.3,
        });
        circle.setMap(map);

        // 도시 이름 텍스트 오버레이
        const overlayContent = `<div style="
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #ff6a6a;
          border-radius: 6px;
          font-weight: bold;
          color: #d33;
          white-space: nowrap;
          font-size: 13px;
          text-align: center;
        ">${city.name}</div>`;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: city.latlng,
          content: overlayContent,
          yAnchor: 1.2, // 텍스트를 원형 아래쪽에 붙이기 위해 조정
        });
        customOverlay.setMap(map);
      });
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSlide === slideCount) {
      const timeout = setTimeout(() => setCurrentSlide(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentSlide]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setActiveSection("restaurants");

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
          {/* 배너 영역 */}
          <div className="banner">
            <div
              className={`slides-container-vertical ${currentSlide === slideCount ? "no-transition" : ""}`}
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

          {/* 지도 및 도시 선택 버튼, 소개글 영역 */}
          <div className="map-description-container">
            <div id="kakao-map" style={{ width: "380px", height: "300px", borderRadius: "100px" }}></div>

            <div className="grid-buttons">
              {[
                "전체",
                "고성",
                "속초",
                "양양",
                "강릉",
                "동해",
                "삼척",
                "울진",
                "영덕",
                "포항",
                "경주",
                "울산",
                "부산",
              ].map((city, idx) => (
                <button
                  key={idx}
                  className={selectedCity === city ? "active" : ""}
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* 선택된 도시에 따른 소개글 컴포넌트 조건부 렌더링 */}
            {selectedCity === "전체" && (
              <Seven activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "부산" && (
              <Busan activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "동해" && (
              <Donghae activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "강릉" && (
              <Gangneung activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "고성" && (
              <Goseong activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "경주" && (
              <Gyeongju activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "포항" && (
              <Pohang activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "삼척" && (
              <Samcheok activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "속초" && (
              <Sokcho activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "울진" && (
              <Uljin activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "울산" && (
              <Ulsan activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "양양" && (
              <Yangyang activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
            {selectedCity === "영덕" && (
              <Yeongdeok activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
          </div>

          {/* 음식점 / 게시글(스레드) 탭 선택 버튼 */}
          <div className="section-tabs" style={{ margin: "20px 0" }}>
            <button
              className={`tab-button ${activeSection === "restaurants" ? "active" : ""}`}
              onClick={() => setActiveSection("restaurants")}
            >
              음식점
            </button>
            <button
              className={`tab-button ${activeSection === "posts" ? "active" : ""}`}
              onClick={() => setActiveSection("posts")}
            >
              스레드
            </button>
          </div>

          {/* 활성 섹션에 따른 컴포넌트 렌더링 */}
          <div className="page-content">
            {activeSection === "restaurants" && (
              <HomeCardFeed selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
            )}
            {activeSection === "posts" && <PostList />}
          </div>

          <hr className="separator" />
        </div>
      </div>
    </div>
  );
}

export default Home;