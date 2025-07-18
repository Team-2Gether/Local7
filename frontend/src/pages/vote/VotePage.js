import React, { useState, useEffect } from 'react';
// import VotePageComSection from './components/VotePage_comSection';
import VotePagePost from './components/VotePage_post';
import VotePageResult from './components/VotePage_result';
import axios from 'axios';
import './VotePage.css';

// 투표 메인 함수
function VotePage() {
  const [regions, setRegions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);
  const [userId, setUserId] = useState(null);

  //로그인 상태 확인
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/status', { withCredentials: true })
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUserId(res.data.userId);
        } else {
          setUserId(null);
        }
      })
      .catch((err) => {
        console.error('로그인 상태 확인 실패', err);
      });
  }, []);

  // 투표 여부 확인
  useEffect(() => {
    if (!userId) return; // 로그인 안되었으면 실행 안함

    axios
      .get('http://localhost:8080/api/vote/userId', { withCredentials: true })
      .then((res) => {
        // 예: res.data가 [{...}] 리스트인 경우
        // 투표 여부 판단 로직 필요
        if (res.data.some((vote) => vote.hasVoted === 'Y')) {
          setHasVoted(true);
          setSelectedOption(res.data[0].regionId); // 예시
        }
      })
      .catch((err) => {
        console.error('투표 여부 상태 불러오기 실패', err);
      });
  }, [userId]);

  // 지역 데이터 불러오기
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/vote/regions', { withCredentials: true })
      .then((res) => {
        setRegions(
          res.data.map((region) => ({
            key: region.regionId,
            name: region.krName,
          }))
        );
      })
      .catch((err) => {
        console.error('지역 데이터 불러오기 실패', err);
      });
  }, []);

  // 투표하기 버튼 클릭
  const handleVoteClick = () => {
    if (!selectedOption || hasVoted) return;

    axios
      .post(
        'http://localhost:8080/api/vote/votes',
        { regionId: selectedOption },
        { withCredentials: true }
      )
      .then(() => {
        setHasVoted(true);
      })
      .catch((err) => {
        console.error('투표 유저 정보 불러오기 실패', err);
      });
  };

  //탭 전환
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
      {selectedTap === 'place' && (
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
                {region.name}
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

          <br />

          {/* 투표 현황보러가기 버튼 */}
          <button
            className="vote-result-Button"
            onClick={() => handleTapClick('result')}
          >
            투표 현황보러 가기
          </button>
        </>
      )}

      {selectedTap === 'result' && (
        <>
          <VotePageResult />
        </>
      )}

      {selectedTap === 'post' && (
        <>
          <VotePagePost />
        </>
      )}
    </div>
  );
}

export default VotePage;
