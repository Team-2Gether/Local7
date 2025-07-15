import React, { useState, useEffect } from 'react';
import '../VotePage.css';
import VotePage_comItem from './VotePage_comItem';
import VotePage_comAdd from './VotePage_comAdd';
import { commentSamples } from './VotePage_samples';
import axios from 'axios';

//댓글 메인섹션 로직
function VotePage_comSection() {
  const [comments, setComments] = useState(commentSamples);
  const [input, setInput] = useState('');

  //댓글 불러오기 hook(벡인드 추가 로직)
  useEffect(() => {
    axios
      .get('/api/comments') // Spring Boot와 프록시 설정 필요
      .then((res) => setComments(res.data))
      .catch((err) => console.error('댓글 불러오기 실패:', err));
  }, []);

  //add 댓글 로직
  const handleSubmit = () => {
    VotePage_comAdd(input, setInput, comments, setComments); // js용(벡엔드 미적용용)
    // 벡엔트 추가 로직--------------------------
    if (!input.trim()) return;

    axios
      .post('/api/comments', { content: input })
      .then(() => {
        setInput('');
        // 다시 불러오기
        return axios.get('/api/comments');
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.error('댓글 등록 실패:', err));
  };
  // ----------------------------------------------

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
