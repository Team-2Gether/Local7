import React from "react";

// Gangneung 컴포넌트는 '강릉' 도시 소개 및
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 바뀌며,
// 버튼 클릭 시 setActiveSection 함수를 호출해 부모 컴포넌트의 상태를 변경합니다.
const Gangneung = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름 및 영어 표기 */}
    <h2>
      강릉
      <span>_GANGNEUNG</span>
    </h2>

    {/* 도시 설명 문구 */}
    <p>
      강릉은 산과 바다가 만나는 곳으로, 오랜 시간 자연과 공존해 온 도시다.
      그 속에서 사람들은 계절의 변화를 따라 음식을 만들며,
      전통과 현대가 어우러진 풍부한 맛을 전한다.
      강릉의 음식은 자연의 품 안에서 자란 삶의 기록이다.
    </p>
  </div>
);

export default Gangneung;
