import './VotePage.css';

//댓글 양식 로직(컴포넌트)
function VotePage_comItem({ comment }) {
  return (
    <div className="comment-item">
      <img src={comment.profileImg} alt="profile" className="profile-img" />
      <div className="comment-content">
        <div className="top-line">
          <span className="nickname">{comment.nickName}</span>
          <span className="time">{comment.time}</span>
          <div className="report">신고</div>
          <div className="date">{comment.date}</div>
        </div>

        <div className="text">{comment.text}</div>
      </div>
    </div>
  );
}

export default VotePage_comItem;
