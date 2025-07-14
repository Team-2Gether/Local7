import React, { useState } from 'react';
import './VotePage.css';
import VotePage_comItem from './VotePage_comItem';
import VotePage_comAdd from './VotePage_comAdd';
import { commentSamples } from './VotePage_samples';

//댓글 메인섹션 로직
function VotePage_comSection() {
  const [comments, setComments] = useState(commentSamples);
  const [input, setInput] = useState('');

  //add 댓글 로직
  const handleSubmit = () => {
    VotePage_comAdd(input, setInput, comments, setComments);
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
