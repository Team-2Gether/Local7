import React from "react";

// Yeongdeok 컴포넌트는 영덕 지역 소개와
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 변하며,
// 버튼 클릭 시 setActiveSection 함수를 호출해 부모 컴포넌트 상태를 변경합니다.
const Yeongdeok = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시명 및 영어 표기 */}
    <h2>
      영덕
      <span>_YEONGDEOK</span>
    </h2>

    {/* 도시 소개 문구 */}
    <p>
      영덕은 신선한 대게와 푸른 바다로 유명한 곳이다.
      바다의 선물을 감사히 여기며 살아온 사람들의 삶이,
      음식 문화에 따뜻한 감성과 풍요를 더해주고 있다.
      영덕의 맛은 바다와 사람의 깊은 교감에서 비롯된다.
    </p>

  </div>
);

export default Yeongdeok;
