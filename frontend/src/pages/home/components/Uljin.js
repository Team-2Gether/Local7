import React from "react";

// Uljin 컴포넌트는 울진 지역 소개와
// '음식점' 및 '게시글' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 바꾸며,
// 버튼 클릭 시 부모 컴포넌트 상태 변경 함수 setActiveSection을 호출합니다.
const Uljin = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시명 및 영어 표기 */}
    <h2>
      울진
      <br />
      <span>__ULJIN</span>
    </h2>

    {/* 도시 소개 텍스트 */}
    <p>
      울진은 깊은 산과 맑은 바다가 만나 조화를 이루는 곳이다.
      수백 년 동안 자연과 함께 살아온 이들의 정성과 삶이,
      지역 음식 문화에 따뜻한 온기와 풍요를 더하고 있다.
      울진의 맛은 자연과 인간이 만들어낸 소중한 이야기다.
    </p>

    {/* 버튼 그룹
        - activeSection에 따라 버튼 스타일 변경
        - 클릭 시 setActiveSection 호출하여 부모 상태 변경
    */}
    <div className="desc-buttons">
      <button
        className={activeSection === "restaurants" ? "yellow-btn" : "white-btn"}
        onClick={() => setActiveSection("restaurants")}
      >
        음식점
      </button>
      <button
        className={activeSection === "posts" ? "yellow-btn" : "white-btn"}
        onClick={() => setActiveSection("posts")}
      >
        게시글
      </button>
    </div>
  </div>
);

export default Uljin;
