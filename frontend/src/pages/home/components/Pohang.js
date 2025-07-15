import React from "react";

// Pohang 컴포넌트는 '포항' 도시 소개와
// '음식점', '스레드' 버튼을 통해 부모 컴포넌트의 activeSection 상태를 변경합니다.
const Pohang = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름과 영어 표기 */}
    <h2>
      포항
      <br />
      <span>_POHANG</span>
    </h2>

    {/* 도시 설명 */}
    <p>
      포항은 바다와 산업이 함께 어우러진 도시다.
      활기찬 항구와 굳건한 철강 산업 속에서,
      사람들은 바다의 신선한 선물과 열정을 음식으로 표현해 왔다.
      포항의 음식은 강인한 삶의 모습과 자연의 풍요로움을 닮았다.
    </p>
  </div>
);

export default Pohang;
