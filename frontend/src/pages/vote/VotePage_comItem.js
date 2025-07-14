import './VotePage.css';

//댓글 양식 로직(컴포넌트)
function VotePage_comItem({ comment }) {
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
            <span className="report">신고</span>
            <span className="date">{comment.date}</span>
          </div>
        </div>
        <span className="text">{comment.text}</span>
      </div>
    </div>
  );
}

export default VotePage_comItem;
