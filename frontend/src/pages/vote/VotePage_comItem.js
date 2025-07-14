import React, { useState } from 'react';
import './VotePage.css';

// 댓글 양식 컴포넌트
function VotePage_comItem({ comment }) {
  const [isReported, setIsReported] = useState(false); // 신고 여부 상태

  const handleReport = () => {
    setIsReported(true); // 신고 시 상태를 true로 변경
  };

  return (
    <div className="comment-item">
      <img src={comment.profileImg} alt="profile" className="profile-img" />
      <div className="comment-content">
        <div className="top-line">
          <div>
            <span className="nickName">{comment.nickName}</span>
            <span className="time">{comment.time}</span>
          </div>

          <div>
            <span
              className={`${isReported ? 'reported' : 'report'}`}
              onClick={handleReport}
            >
              {isReported ? '신고됨' : '신고'}
            </span>
            <span className="date">{comment.date}</span>
          </div>
        </div>
        <span className="text">{comment.text}</span>
      </div>
    </div>
  );
}

export default VotePage_comItem;
