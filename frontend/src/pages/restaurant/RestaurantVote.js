import React, { useState } from 'react';
import './RestaurantVote.css';

// 투표지역 항목 자동 생성 필드(추가된 항목 개수가 일치해야함)
const initialVotes = Array.from({ length: 12 }, (_, i) =>
  String.fromCharCode(65 + i)
).reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {});

// 투표 메인 함수
function RestaurantVote() {
  const [votes, setVotes] = useState(initialVotes);
  const [selectedOption, setSelectedOption] = useState(null);

  // 투표 카운트 함수
  const handleVote = (option) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [option]: prevVotes[option] + 1,
    }));
    setSelectedOption(option);
  };

  // 지역 리스트(항목 추가하려면 같은 양식으로 지역 추가하면 됨)(DB연결전 임시)
  const regionNames = [
    '고성',
    '속초',
    '양양',
    '강릉',
    '동해',
    '삼척',
    '울진',
    '영덕',
    '포항',
    '경주',
    '울산',
    '부산',
  ];

  // 지역 항목 맵핑
  const regions = regionNames.map((name, i) => ({
    key: String.fromCharCode(65 + i),
    name,
  }));

  return (
    <div className="vote-container">
      <div className="tap-contents">
        <div>이달의 여행지</div>
        <div>이달의 게시물</div>
      </div>

      <h2>이달의 여행지를 투표해주세요</h2>
      <div className="vote-buttons">
        {regions.map((region) => (
          <button
            key={region.key}
            onClick={() => handleVote(region.key)}
            className={selectedOption === region.key ? 'selected' : ''}
          >
            {region.name} ({votes[region.key]})
          </button>
        ))}
      </div>

      <button className="vote-todo-Button">투표하기</button>

      <div className="views-container">
        <div className="views-contents">
          <div>사용자프로필</div>
          <span>/사용자닉네임/</span>
          <span>댓글 내용</span>
        </div>

        <div className="views-submit">
          <input type="text"></input>
          <button>입력</button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantVote;
