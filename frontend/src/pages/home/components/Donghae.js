import React from "react";

// Donghae 컴포넌트는 '동해' 도시 소개 및
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 바뀌며,
// 버튼 클릭 시 setActiveSection 함수를 호출해 부모 컴포넌트의 상태를 변경합니다.
const Donghae = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름 및 영어 표기 */}
    <h2>
      동해
      <span>__DONGHAE</span>
    </h2>

    {/* 도시 설명 문구 */}
    <p>
      동해는 푸른 바다와 맑은 하늘이 어우러진 자연의 고장이다.
      이곳 사람들은 바다가 준 풍요로움 속에서 삶을 이어왔고,
      그들의 정성과 노력이 깊은 음식 문화에 고스란히 스며 있다.
      동해의 음식은 자연과 인간이 함께 빚어낸 이야기다.
    </p>

    {/* 버튼 그룹: 음식점 / 스레드
        - 버튼 클릭 시 부모에서 내려준 setActiveSection 함수를 호출해 상태 변경
        - activeSection 상태에 따라 현재 활성화된 버튼은 노란색(yellow-btn), 비활성화는 흰색(white-btn)으로 스타일링됨
    */}
  </div>
);

export default Donghae;
