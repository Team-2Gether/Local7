import React from "react";

// Seven 컴포넌트는 7번 국도 소개와
// '음식점'과 '스레드' 버튼을 보여주며,
// 버튼 클릭 시 부모 컴포넌트의 activeSection 상태를 변경합니다.
const Seven = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 제목과 영어 표기 */}
    <h2>
      7번 국도
      <span>_STATE ROUTE7</span>
    </h2>

    {/* 설명 문구 */}
    <p>
      7번국도는 동해안을 따라 고성에서 부산까지 이어지는 긴 길이다.
      해안선을 따라 펼쳐진 각 도시마다 저마다의 맛과 풍경이 깃들어 있으며,
      7번국도는 바다와 산, 그리고 사람들의 정이 어우러진 길로,
      그 끝자락에서 만나는 수많은 이야기들이 이 길을 특별하게 만든다.
    </p>
  </div>
);

export default Seven;
