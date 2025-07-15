import React from "react";

// Donghae 컴포넌트는 '동해' 도시 소개 및
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 바뀌며,
// 버튼 클릭 시 setActiveSection 함수를 호출해 부모 컴포넌트의 상태를 변경합니다.
const Busan = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름 및 영어 표기 */}
    <h2>
      부산<br></br>
      <span>_BUSAN</span>
    </h2>

    {/* 도시 설명 문구 */}
    <p>
      부산은 오랜 세월 동안 바다와 사람들의 삶이 맞닿아 온 곳이다.
      수많은 어부들과 상인들이 모여 활기찬 항구를 이루며,
      그 속에서 피어난 음식 문화는 바다의 신선함과 도시의 다채로움을 담고 있다.
      부산의 맛은 단순한 먹거리를 넘어, 삶의 열정과 기억을 품고 있다.
    </p>
  </div>
);

export default Busan;
