import React, { useState } from 'react';
import './VotePage.css';
import VotePage_comItem from './VotePage_comItem';
import VotePage_add_com from './VotePage_add_com';
import VotePage_sampleCom from './VotePage_sampleCom';

//댓글 메인섹션 로직
function VotePage_comSection() {
  const [comments, setComments] = useState(VotePage_sampleCom);
  const [input, setInput] = useState('');

  //add 댓글 로직
  const handleSubmit = () => {
    VotePage_add_com(input, setInput, comments, setComments);
  };

  return (
    <div className="comment-section">
      {comments.map((c) => (
        <VotePage_comItem key={c.id} comment={c} />
      ))}
      <div className="comment-input">
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>입력</button>
      </div>
    </div>
  );
}

export default VotePage_comSection;
