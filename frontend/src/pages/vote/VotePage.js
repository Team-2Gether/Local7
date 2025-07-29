// frontend/src/pages/VotePage.js
import React, { useState, useEffect } from 'react';
import VotePagePost from './components/VotePage_post';
import VotePageResult from './components/VotePage_result';
import axios from 'axios';
import '../../assets/css/VotePage.css';

function VotePage() {
  const [regions, setRegions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTap, setSelectedTap] = useState('place');
  const [hasVoted, setHasVoted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [topRegionName, setTopRegionName] = useState('없음');

  // 지역 이름 기준 이미지 경로 매핑 함수 (한글명 → /폴더 이미지)
  const getImageByRegionName = (name) => {
    const map = {
      부산: '/busan.png',
      동해: '/donghae.png',
      강릉: '/gangneung.png',
      고성: '/goseong.png',
      경주: '/gyeongju.png',
      포항: '/pohang.png',
      삼척: '/samcheok.png',
      속초: '/sokcho.png',
      울진: '/uljin.png',
      울산: '/ulsan.png',
      양양: '/yangyang.png',
      영덕: '/yeongdeok.png',
    };
    return map[name] || '/default-image.jpg';
  };

  useEffect(() => {
    const init = async () => {
      fetchUserStatus();
      fetchRegions();
      fetchTopRegionName(); // 페이지 로드 시 topRegionName을 가져오도록 추가
    };
    init();
  }, []);

  useEffect(() => {
    if (userId) fetchUserVoteStatus();
  }, [userId]);

  // regions나 selectedOption이 변경될 때 slideIndex를 업데이트
  useEffect(() => {
    if (regions.length > 0 && selectedOption !== null) {
      const currentRegionIndex = regions.findIndex(
        (region) => region.key === selectedOption
      );
      if (currentRegionIndex !== -1 && currentRegionIndex !== slideIndex) {
        setSlideIndex(currentRegionIndex);
      }
    }
  }, [selectedOption, regions]);

  const fetchUserStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/auth/status', {
        withCredentials: true,
      });
      setUserId(res.data.isLoggedIn ? res.data.userId : null);
    } catch (err) {
      console.error('로그인 상태 확인 실패', err);
    }
  };

  const fetchUserVoteStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/vote/userId', {
        withCredentials: true,
      });

      const voteData = Array.isArray(res.data) ? res.data[0] : res.data;

      console.log('user vote 상태', voteData);
      console.log('hasVoted 설정:', voteData.hasVoted === 'Y');
      if (voteData && voteData.hasVoted === 'Y') {
        setHasVoted(true);
        setSelectedOption(voteData.votedRegion);
        const idx = regions.findIndex((r) => r.key === voteData.votedRegion);
        if (idx >= 0) setSlideIndex(idx);
      } else {
        if (regions.length > 0) {
          setSelectedOption(regions[0].key);
          setSlideIndex(0);
        }
      }
    } catch (err) {
      console.error('투표 여부 상태 불러오기 실패', err);
      if (regions.length > 0) {
        setSelectedOption(regions[0].key);
        setSlideIndex(0);
      }
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/vote/regions', {
        withCredentials: true,
      });

      const regionsWithImg = res.data.map((region) => ({
        key: region.regionId,
        name: region.krName,
        imgUrl:
          region.imgUrl && region.imgUrl.trim() !== ''
            ? region.imgUrl
            : getImageByRegionName(region.krName),
        voteCount: region.voteCount || 0,
      }));

      setRegions(regionsWithImg);
    } catch (err) {
      console.error('지역 데이터 불러오기 실패', err);
    }
  };

  // VotePageResult와 동일한 로직으로 topRegionName을 가져오는 함수 추가
  const fetchTopRegionName = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/vote/voted-counts');
      if (response.data.length > 0) {
        const topResult = response.data[0];
        setTopRegionName(topResult.krName);
      } else {
        setTopRegionName('없음');
      }
    } catch (error) {
      console.error('상위 지역 이름 불러오기 실패:', error);
      setTopRegionName('없음');
    }
  };

  const handleVoteClick = async () => {
    if (!selectedOption || hasVoted) return;
    try {
      await axios.post(
        'http://localhost:8080/api/vote/votes',
        { regionId: selectedOption },
        { withCredentials: true }
      );
      setHasVoted(true);
      alert('투표가 완료되었습니다!');
      fetchRegions();
      fetchUserVoteStatus();
      fetchTopRegionName(); // 투표 완료 후 topRegionName 업데이트
    } catch (err) {
      console.error('투표 처리 실패', err);
      alert('투표 중 오류가 발생했습니다.');
    }
  };

  const handleTapClick = (tap) => {
    setSelectedTap(tap);
  };

  const prevSlide = () => {
    if (regions.length === 0) return;
    setSlideIndex((prev) => {
      const newIndex = prev === 0 ? regions.length - 1 : prev - 1;
      setSelectedOption(regions[newIndex].key);
      return newIndex;
    });
  };

  const nextSlide = () => {
    if (regions.length === 0) return;
    setSlideIndex((prev) => {
      const newIndex = prev === regions.length - 1 ? 0 : prev + 1;
      setSelectedOption(regions[newIndex].key);
      return newIndex;
    });
  };

  const handleRegionClick = (regionKey, index) => {
    setSelectedOption(regionKey);
    setSlideIndex(index);
  };

  return (
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
            className={selectedTap === 'result' ? 'tap selected-tap' : 'tap'}
            onClick={() => handleTapClick('result')}
          >
            투표 진행 상황
          </div>
          <div
            className={selectedTap === 'post' ? 'tap selected-tap' : 'tap'}
            onClick={() => handleTapClick('post')}
          >
            이달의 게시물
          </div>
        </div>
        <div className="best-reigon">
          이번달의 선정지는
          <p className="best-reigon1">{topRegionName}</p>
        </div>
      </div>

      {selectedTap === 'place' && (
        <>
          <h2>다음달의 여행지를 투표해주세요</h2>
          <div className="vote-main-content">
            {regions.length > 0 && (
              <div className="slide-container">
                <button
                  className="slide-btn prev"
                  onClick={prevSlide}
                  aria-label="이전 이미지"
                >
                  &#10094;
                </button>
                <div className="slide-content">
                  <img
                    src={regions[slideIndex].imgUrl}
                    alt={regions[slideIndex].name}
                    className="slide-image"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  />
                  <div className="slide-label">{regions[slideIndex].name}</div>
                </div>
                <button
                  className="slide-btn next"
                  onClick={nextSlide}
                  aria-label="다음 이미지"
                >
                  &#10095;
                </button>
              </div>
            )}

            <div
              className="vote-controls"
              style={{ zIndex: 2, position: 'relative' }}
            >
              <div className="vote-buttons">
                {regions.map((region, index) => (
                  <button
                    key={region.key}
                    onClick={() => handleRegionClick(region.key, index)}
                    className={
                      selectedOption === region.key ? 'selected-region' : ''
                    }
                    disabled={hasVoted}
                    type="button"
                  >
                    {region.name}
                  </button>
                ))}
              </div>

              <button
                className="vote-todo-Button"
                onClick={handleVoteClick}
                disabled={hasVoted || !selectedOption}
                type="button"
              >
                {hasVoted ? '투표 완료' : '투표하기'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* VotePageResult에 setTopRegionName을 props로 전달 */}
      {selectedTap === 'result' && <VotePageResult setTopRegionName={setTopRegionName} />}
      {selectedTap === 'post' && <VotePagePost />}
    </div>
  );
}

export default VotePage;