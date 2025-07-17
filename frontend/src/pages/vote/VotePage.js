import React, { useState, useEffect } from 'react';
// import VotePageComSection from './components/VotePage_comSection';
import VotePagePost from './components/VotePage_post';
import axios from 'axios';
import './VotePage.css';

// 투표 메인 함수
function VotePage() {
  const [regions, setRegions] = useState([]); // key 포함된 구조
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);
  const storedUserId = sessionStorage.getItem('userId');
  const userId = storedUserId ? parseInt(storedUserId, 10) : null; //유저 id 값

  // 투표 여부 확인 요청 (userId가 있을 경우에만)
  useEffect(() => {
    console.log('storedUserId:', storedUserId);
    console.log('userId:', userId);
    if (userId !== null) {
      console.log('axios 요청 시작');
      axios
        .get(`http://localhost:8080/api/vote/userId`, { params: { userId } })
        .then((res) => {
          const user = res.data;
          if (user.hasVoted === 'Y') {
            setHasVoted(true);
            localStorage.setItem(`hasVoted_user_${userId}`, true); // 로컬에도 동기화
            localStorage.setItem(`votedRegion_user_${userId}`, user.regionId); // regionId도 저장
            setSelectedOption(user.regionId); // 이전에 선택한 지역으로 반영
          }
        })
        .catch((err) => console.error('유저 정보 불러오기 실패:', err));
    }
  }, [userId]);

  // 최초 1회 DB에서 지역 데이터 받아오기
  useEffect(() => {
    // -----------------------------------------------------------
    // const voted = localStorage.getItem(`hasVoted_user_${userId}`);

    // if (voted) {
    //   setHasVoted(true);
    // }
    // -------------------------------------------------------------------
    axios
      .get('http://localhost:8080/api/vote/regions')
      .then((res) => {
        // DB에서 regionId와 regionDescription 받아옴
        const mappedRegions = res.data.map((region) => ({
          key: region.regionId, // DB에서 받은 region_id 사용
          name: region.krName, // DB에서 받은 region_description(krName) 사용
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

      // ✅ 로컬스토리지에 저장
      localStorage.setItem(`hasVoted_user_${userId}`, true);
      localStorage.setItem(`votedRegion_user_${userId}`, selectedOption);

      // 이용자 정보 post요청
      axios
        .post('http://localhost:8080/api/vote/votes', {
          userId: userId,
          regionId: selectedOption,
        })
        .then((res) => {
          console.log('투표 성공:', res.data);
        })
        .catch((err) => {
          console.error('투표 실패:', err);
        });
    }
  };

  const handleTapClick = (tap) => {
    setSelectedTap(tap);
  };

  return (
    // 탭 선택 영역
    <div className="vote-container">
      <div className="vote-header">
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

        <p className="best-reigon">N 월의 선정지는 M 입니다</p>
      </div>

      {/* 탭 전환에 따른 내용 표시 */}
      {selectedTap === 'place' ? (
        <>
          <h2>이달의 여행지를 투표해주세요</h2>

          {/* 해당 각 지역 선택 버튼 */}
          <div className="vote-buttons">
            {regions.map((region) => (
              <button
                key={region.key}
                onClick={() => setSelectedOption(region.key)}
                className={
                  selectedOption === region.key ? 'selected-region' : ''
                }
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
          {/* <VotePageComSection /> */}
        </>
      ) : (
        <>
          {/* 이달의 게시물 컴포넌트 */}
          <VotePagePost />
        </>
      )}
    </div>
  );
}

export default VotePage;
