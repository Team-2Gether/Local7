import React, { useState, useEffect } from 'react';
import VotePagePost from './components/VotePage_post';
import VotePageResult from './components/VotePage_result';
import axios from 'axios';
import './VotePage.css';

function VotePage() {
  const [regions, setRegions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);
  const [userId, setUserId] = useState(null);

  // 현재 슬라이드 인덱스 상태
  const [slideIndex, setSlideIndex] = useState(0);

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

  useEffect(() => {
    if (!userId) return;

    axios
      .get('http://localhost:8080/api/vote/userId', { withCredentials: true })
      .then((res) => {
        if (res.data.some((vote) => vote.hasVoted === 'Y')) {
          setHasVoted(true);
          setSelectedOption(res.data[0].regionId);
        }
      })
      .catch((err) => {
        console.error('투표 여부 상태 불러오기 실패', err);
      });
  }, [userId]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/vote/regions', { withCredentials: true })
      .then((res) => {
        // 서버에서 받은 지역 데이터에 이미지 URL(imgUrl)도 포함되어 있다고 가정
        setRegions(
          res.data.map((region) => ({
            key: region.regionId,
            name: region.krName,
            imgUrl: region.imgUrl || './default-image.jpg', // 이미지가 없으면 기본 이미지 지정
          }))
        );
      })
      .catch((err) => {
        console.error('지역 데이터 불러오기 실패', err);
      });
  }, []);

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

  const handleTapClick = (tap) => {
    setSelectedTap(tap);
  };

  // 이전 슬라이드 버튼 클릭 핸들러
  const prevSlide = () => {
    setSlideIndex((prev) => (prev === 0 ? regions.length - 1 : prev - 1));
  };

  // 다음 슬라이드 버튼 클릭 핸들러
  const nextSlide = () => {
    setSlideIndex((prev) => (prev === regions.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="vote-container">
      {/* 상단 헤더 및 탭 영역 */}
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
        <p className="best-reigon">이번달의 선정지는 M 입니다</p>
      </div>

      {/* 이달의 여행지 탭 선택 시 */}
      {selectedTap === 'place' && (
        <>
          <h2>다음달의 여행지를 투표해주세요</h2>

          {/* --------------------------
              이미지 슬라이드 영역
              -------------------------- */}
          {regions.length > 0 && (
            <div className="slide-container">
              {/* 좌측 이전 슬라이드 버튼 */}
              <button className="slide-btn prev" onClick={prevSlide} aria-label="이전 이미지">
                &#10094;
              </button>

              {/* 현재 슬라이드 이미지 및 라벨 */}
              <div className="slide-content">
                <img
                  src={regions[slideIndex].imgUrl}
                  alt={regions[slideIndex].name}
                  className="slide-image"
                />
                <div className="slide-label">{regions[slideIndex].name}</div>
              </div>

              {/* 우측 다음 슬라이드 버튼 */}
              <button className="slide-btn next" onClick={nextSlide} aria-label="다음 이미지">
                &#10095;
              </button>
            </div>
          )}

          {/* 투표 버튼 그룹 */}
          <div className="vote-buttons">
            {regions.map((region) => (
              <button
                key={region.key}
                onClick={() => setSelectedOption(region.key)}
                className={selectedOption === region.key ? 'selected-region' : ''}
                disabled={hasVoted}
              >
                {region.name}
              </button>
            ))}
          </div>

          {/* 투표하기 버튼 */}
          <button
            className="vote-todo-Button"
            onClick={handleVoteClick}
            disabled={hasVoted || !selectedOption}
          >
            투표하기
          </button>

          {/* 투표 현황 보기 버튼 */}
          <button className="vote-result-Button" onClick={() => handleTapClick('result')}>
            투표 현황보러 가기
          </button>
        </>
      )}

      {/* 결과 탭, 게시물 탭 컴포넌트 */}
      {selectedTap === 'result' && <VotePageResult />}
      {selectedTap === 'post' && <VotePagePost />}
    </div>
  );
}

export default VotePage;
