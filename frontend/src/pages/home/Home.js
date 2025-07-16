import React, { useEffect, useState } from "react";
import axios from "axios";

// 🖼️ 배너 이미지들
import banner1 from "../../assets/images/banner.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";

// 📌 "전체" 선택 시 표시할 Seven 컴포넌트
import Seven from "./components/Seven";

// 🍽️ 음식점 카드 컴포넌트
import HomeCardFeed from "./HomeCardFeed";

// 📝 게시글(스레드) 컴포넌트
import PostList from "../post/components/PostList";

// 🎨 CSS
import "./Home.css";

function Home() {
  // 👉 선택된 도시 (기본은 "속초")
  const [selectedCity, setSelectedCity] = useState("속초");
  // 👉 DB에서 불러온 지역 정보 (regionName, regionDescription, viewCount)
  const [regionInfo, setRegionInfo] = useState(null);
  // 👉 카카오 지도 객체
  const [mapObj, setMapObj] = useState(null);
  // 👉 음식점 / 게시글 탭 상태
  const [activeSection, setActiveSection] = useState("restaurants");
  // 👉 배너 슬라이드 인덱스
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = 3;

  // ✅ 카카오 지도 초기 세팅
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=690813b8710fce175e3acf9121422624&libraries=services";
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("kakao-map");
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.75), // 대한민국 중심
        level: 14,
      };
      const map = new window.kakao.maps.Map(container, options);
      setMapObj(map);

      // ✅ 주요 도시 포인트 및 원 표시
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

      // ✅ 도시들을 잇는 노란 라인
      const linePath = cityPoints.map((c) => c.latlng);
      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFCC00",
        strokeOpacity: 0.8,
      });
      polyline.setMap(map);

      // ✅ 각 도시에 원, 오버레이 이름
      cityPoints.forEach((city) => {
        const circle = new window.kakao.maps.Circle({
          center: city.latlng,
          radius: 1000,
          strokeWeight: 3,
          strokeColor: "#ff6a6aff",
          strokeOpacity: 0.7,
          fillColor: "#ff6a6aff",
          fillOpacity: 0.3,
        });
        circle.setMap(map);

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
          yAnchor: 1.2,
        });
        customOverlay.setMap(map);
      });
    };
    document.head.appendChild(script);
  }, []);

  // ✅ 배너 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 슬라이드 3개 넘어가면 처음으로
  useEffect(() => {
    if (currentSlide === slideCount) {
      const timeout = setTimeout(() => setCurrentSlide(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentSlide]);

  // ✅ 도시 버튼 클릭 시
  const handleCityClick = async (city) => {
    setSelectedCity(city); // 도시 변경
    setActiveSection("restaurants"); // 음식점으로 탭 초기화

    if (city === "전체") {
      setRegionInfo(null); // Seven 컴포넌트만 보여주게
    } else {
      try {
        const res = await axios.get(`/api/region/getRegionInfoByName`, {
          params: { regionName: city },
        });
        setRegionInfo(res.data); // DB에서 지역 정보 세팅
      } catch (error) {
        console.error("지역 정보 불러오기 실패:", error);
        setRegionInfo(null);
      }
    }

    // ✅ 지도 위치 이동
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
          {/* 🔸 배너 영역 */}
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

          {/* 🔸 지도 + 버튼 + 도시 설명 */}
          <div className="map-description-container">
            <div
              id="kakao-map"
              style={{ width: "380px", height: "300px", borderRadius: "100px" }}
            ></div>

            {/* 도시 버튼 */}
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

            {/* 도시 정보 (전체 아닐 때만) */}
            {selectedCity !== "전체" && regionInfo && (
              <div className="region-description">
                <h3>{regionInfo.regionName}</h3>
                <p>{regionInfo.regionDescription}</p>
                <p>조회수: {regionInfo.viewCount}</p>
              </div>
            )}

            {/* 전체 선택 시 Seven 컴포넌트 */}
            {selectedCity === "전체" && (
              <Seven activeSection={activeSection} setActiveSection={setActiveSection} />
            )}
          </div>

          {/* 🔸 음식점 / 스레드 탭 */}
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

          {/* 🔸 음식점 or 스레드 표시 */}
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
