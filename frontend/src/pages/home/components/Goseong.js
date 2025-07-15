import React from "react";

// Goseong 컴포넌트는 '고성' 도시 소개와
// '음식점', '스레드' 버튼을 통해 부모 컴포넌트의 activeSection 상태를 변경합니다.
// activeSection 값에 따라 버튼 스타일을 동적으로 적용합니다.
const Goseong = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름과 영어 표기 */}
    <h2>
      고성
      <span>_GOSEONG</span>
    </h2>

    {/* 도시 설명 */}
    <p>
      고성은 청정한 자연과 바다가 어우러진 고장이다.
      오랜 세월 주민들은 자연과 함께 살아가며,
      그들의 삶과 정성은 음식 문화 속에 깊이 배어있다.
      고성의 맛은 자연과 인간이 함께 쌓아온 시간의 결실이다.
    </p>
  </div>
);

export default Goseong;
