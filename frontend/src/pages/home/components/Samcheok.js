import React from "react";

// Samcheok 컴포넌트는 '삼척' 도시 소개와
// '음식점'과 '스레드' 버튼을 제공하며,
// 버튼 클릭 시 부모 컴포넌트의 activeSection 상태를 변경합니다.
const Samcheok = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름 및 영어 표기 */}
    <h2>
      삼척
      <span>__SAMCHEOK</span>
    </h2>

    {/* 도시 설명 */}
    <p>
      삼척은 푸른 바다와 울창한 산림이 공존하는 고장이다.
      그 속에서 사람들은 자연의 선물을 감사히 받아들여,
      풍성한 맛과 따뜻한 이야기를 음식에 담아 전한다.
      삼척의 음식은 자연과 사람의 조화로운 삶의 흔적이다.
    </p>

    {/* 버튼 그룹
        - activeSection 상태에 따라 버튼 스타일 변경 (노란색/흰색)
        - 클릭 시 setActiveSection 함수 호출하여 상태 변경
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
        스레드
      </button>
    </div>
  </div>
);

export default Samcheok;
