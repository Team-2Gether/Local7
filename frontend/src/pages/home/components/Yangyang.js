import React from "react";

// Yangyang 컴포넌트는 양양 지역 소개와
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 변경되고,
// 버튼 클릭 시 setActiveSection 함수를 호출하여 부모 상태를 변경합니다.
const Yangyang = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시명 및 영어 표기 */}
    <h2>
      양양
      <span>__YANGYANG</span>
    </h2>

    {/* 도시 소개 텍스트 */}
    <p>
      양양은 청정한 자연과 고요한 바다가 만나는 곳이다.
      자연이 선사한 재료들로 사람들은 소박하지만 깊은 맛을 만들고,
      그 음식은 순수한 자연과 삶의 이야기를 담고 있다.
      양양의 맛은 자연과 인간이 함께 걸어온 길이다.
    </p>

    {/* 버튼 그룹
        - activeSection에 따라 버튼 스타일 변경
        - 클릭 시 setActiveSection 호출해 부모 상태 변경
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

export default Yangyang;
