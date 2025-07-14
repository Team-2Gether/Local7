import React, { useState } from 'react';
import VotePage_comSection from './VotePage_comSection';
import { regionNames } from './VotePage_samples';
import './VotePage.css';

// 투표지역 항목 자동 생성 필드(추가된 항목 개수가 일치해야함)
const initialVotes = Array.from({ length: 12 }, (_, i) =>
  String.fromCharCode(65 + i)
).reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {});

// 지역 항목 맵핑
const regions = regionNames.map((name, i) => ({
  key: String.fromCharCode(65 + i),
  name,
}));

// 투표 메인 함수
function VotePage() {
  const [votes, setVotes] = useState(initialVotes);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);

  // 투표 상태 확인
  const handleVoteClick = () => {
    if (selectedOption && !hasVoted) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [selectedOption]: prevVotes[selectedOption] + 1,
      }));
      setHasVoted(true);
    }
  };

  const handleTapClick = (tap) => {
    setSelectedTap(tap);
  };

  return (
    <div className="vote-container">
      <div className="tap-contents">
        <div
          className={selectedTap === 'place' ? 'tap selected-tap' : 'tap'}
          onClick={() => handleTapClick('place')}
        >
          이달의 여행지
        </div>
        <div
          className={selectedTap === 'post' ? 'tap selected-tap' : 'tap'}
          onClick={() => handleTapClick('post')}
        >
          이달의 게시물
        </div>
      </div>

      <h2>이달의 여행지를 투표해주세요</h2>

      {/* 해당 각 지역 선택 버튼 */}
      <div className="vote-buttons">
        {regions.map((region) => (
          <button
            key={region.key}
            onClick={() => setSelectedOption(region.key)}
            className={selectedOption === region.key ? 'selected-region' : ''}
            disabled={hasVoted}
          >
            {region.name} ({votes[region.key]})
          </button>
        ))}
      </div>
      <br />

      {/* 투표 버튼 */}
      <button
        className="vote-todo-Button"
        onClick={handleVoteClick}
        disabled={hasVoted || !selectedOption}
      >
        투표하기
      </button>

      {/* 댓글 컴포넌트 */}
      <VotePage_comSection />
    </div>
  );
}

export default VotePage;
