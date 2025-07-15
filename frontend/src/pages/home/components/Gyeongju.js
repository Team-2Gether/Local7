import React from "react";

// Gyeongju 컴포넌트는 '경주' 도시 소개 및
// '음식점', '스레드' 버튼을 통해 부모 컴포넌트의 activeSection 상태를 변경합니다.
// activeSection 값에 따라 버튼 스타일을 동적으로 적용합니다.
const Gyeongju = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름과 영어 표기 */}
    <h2>
      경주
      <span>_GYEONGJU</span>
    </h2>

    {/* 도시 설명 */}
    <p>
      경주는 천년 고도의 역사와 문화가 살아 숨 쉬는 도시다.
      수많은 왕조와 문명이 지나간 길 위에서,
      음식은 그 시간을 잇는 매개체로서 과거와 현재의 이야기를 전한다.
      경주의 맛은 긴 시간 속에 쌓인 이야기의 향기다.
    </p>
  </div>
);

export default Gyeongju;
