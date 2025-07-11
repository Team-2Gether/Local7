import React from "react";

// Ulsan 컴포넌트는 울산 지역 소개와
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 변경되고,
// 버튼 클릭 시 setActiveSection 함수를 호출하여 부모 상태를 변경합니다.
const Ulsan = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시명 및 영어 표기 */}
    <h2>
      울산
      <br />
      <span>__ULSAN</span>
    </h2>

    {/* 도시 소개 텍스트 */}
    <p>
      울산은 산업과 자연이 공존하는 도시다.
      바다와 공장의 굉음 속에서도 사람들은 서로를 돌보며,
      그들의 노력과 꿈은 음식 속에 담겨 세대를 잇는다.
      울산의 음식은 강인한 정신과 따뜻한 마음이 어우러진 결과다.
    </p>
  </div>
);

export default Ulsan;
