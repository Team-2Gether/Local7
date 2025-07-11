import React from "react";

// Busan 컴포넌트는 '부산' 도시 소개 및
// '음식점'과 '스레드' 버튼을 제공하는 UI입니다.
// activeSection 상태에 따라 버튼 스타일이 바뀌며,
// 버튼 클릭 시 setActiveSection 함수를 호출해 부모 컴포넌트의 상태를 변경합니다.
const Busan = ({ activeSection, setActiveSection }) => (
  <div className="description-area">
    {/* 도시 이름 및 영어 표기 */}
    <h2>
      부산
      <span>
        <br />
        __BUSAN
      </span>
    </h2>

    {/* 도시 설명 문구 */}
    <p>
      부산은 오랜 세월 동안 바다와 사람들의 삶이 맞닿아 온 곳이다.
      수많은 어부들과 상인들이 모여 활기찬 항구를 이루며,
      부산의 맛은 단순한 먹거리를 넘어, 삶의 열정과 기억을 품고 있다.
    </p>

    {/* 버튼 그룹: 음식점 / 스레드
        - 버튼 클릭 시 부모에서 내려준 setActiveSection 함수를 호출해 상태 변경
        - activeSection 상태에 따라 현재 활성화된 버튼은 노란색(yellow-btn), 비활성화는 흰색(white-btn)으로 스타일링됨
    */}
    <div className="desc-buttons">
      <button
        // activeSection이 'restaurants'일 때 노란색 버튼 스타일 적용
        className={activeSection === "restaurants" ? "yellow-btn" : "white-btn"}
        // 클릭 시 activeSection을 'restaurants'로 변경하여 음식점 목록 보여주기
        onClick={() => setActiveSection("restaurants")}
      >
        음식점
      </button>
      <button
        // activeSection이 'posts'일 때 노란색 버튼 스타일 적용
        className={activeSection === "posts" ? "yellow-btn" : "white-btn"}
        // 클릭 시 activeSection을 'posts'로 변경하여 스레드(게시글) 목록 보여주기
        onClick={() => setActiveSection("posts")}
      >
        스레드
      </button>
    </div>
  </div>
);

export default Busan;
