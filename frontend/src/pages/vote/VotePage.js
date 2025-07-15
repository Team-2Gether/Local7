import React, { useState, useEffect } from 'react';
import VotePageComSection from './components/VotePage_comSection';
// import { regionNames } from './components/VotePage_samples';
import './VotePage.css';
import axios from 'axios';

// 투표 메인 함수
function VotePage() {
  const [regions, setRegions] = useState([]); // key 포함된 구조
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);

  // 최초 1회 DB에서 지역 데이터 받아오기
  useEffect(() => {
    axios
      .get('/api/voteRegions')
      .then((res) => {
        // DB에서 regionId와 regionDescription 받아옴
        const mappedRegions = res.data.map((region) => ({
          key: region.regionId, // DB에서 받은 region_id 사용
          name: region.krName, // DB에서 받은 region_description 사용
        }));
        setRegions(mappedRegions);

        // 여기서 initialVotes를 regionId 기준으로 동적으로 생성
        const votesInit = mappedRegions.reduce((acc, r) => {
          acc[r.key] = 0;
          return acc;
        }, {});
        setVotes(votesInit); // 초기 투표 상태 저장
      })
      .catch((err) => console.error(err));
  }, []);

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
            {region.name} ({votes[region.key] ?? 0})
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
      <VotePageComSection />
    </div>
  );
}

export default VotePage;
