import React from "react";

// Sokcho 컴포넌트는 속초 도시 소개와
// '음식점'과 '스레드' 버튼을 보여주며,
// 버튼 클릭 시 부모 컴포넌트의 activeSection 상태를 변경합니다.
const Sokcho = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시명과 영어 표기 */}
    <h2>
      속초
      <br />
      <span>__SOKCHO</span>
    </h2>

    {/* 도시 소개 문구 */}
    <p>
      속초는 6.25 전쟁 당시 북한에서 내려온 피란민들이 정착한 곳으로,
      그들의 향수와 생활 방식이 음식 문화에 깊이 스며들어 있다.
      이곳의 음식은 단순한 맛을 넘어 역사와 삶의 이야기를 닮고 있다.
    </p>
  </div>
);

export default Sokcho;
