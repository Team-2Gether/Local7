import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/css/VotePage.css';

function VotePageResult() {
  const [voteData, setVoteData] = useState([]);

  // 투표 수 불러오기
  useEffect(() => {
    axios
      .get('http://192.168.0.10:8080/api/vote/results')
      .then((response) => {
        setVoteData(response.data);
      })
      .catch((error) => {
        console.error('투표 결과 불러오기 실패:', error);
      });
  }, []);

  const totalVotes = voteData.reduce((sum, item) => sum + item.viewCount, 0);

  return (
    <div className="vote-result-container">
      <div className="vote-result-header">다음달 선정 투표 현황</div>

      {voteData.map((item, index) => {
        const percent = ((item.viewCount / totalVotes) * 100).toFixed(1);
        return (
          <div className="vote-result-row" key={item.regionId}>
            <div className="vote-result-rank">{index + 1}</div>
            <div
              className={`vote-result-region ${
                index === 0 ? 'first-rank' : ''
              }`}
            >
              {item.krName}
            </div>
            <div className="bar-container">
              <div
                className={`bar ${index === 0 ? 'first-rank' : ''}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="percent">{percent}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default VotePageResult;
