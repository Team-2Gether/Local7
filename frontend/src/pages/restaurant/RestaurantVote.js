import React, { useState } from 'react';
import './RestaurantVote.css';

function RestaurantVote() {
  const [votes, setVotes] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
  });

  const handleVote = (menu) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [menu]: prevVotes[menu] + 1,
    }));
  };

  return (
    <div className="vote-container">
      <div className="tap-contents">
        <div>이달의 여행지</div>
        <div>이달의 게시물</div>
      </div>

      <h2>이달의 여행지를 투표해주세요</h2>
      <div className="vote-buttons">
        <button onClick={() => handleVote('A')}>고성 ({votes.A})</button>
        <button onClick={() => handleVote('B')}>속초 ({votes.B})</button>
        <button onClick={() => handleVote('C')}>양양 ({votes.C})</button>
        <button onClick={() => handleVote('D')}>강릉 ({votes.D})</button>
        <button onClick={() => handleVote('E')}>동해 ({votes.E})</button>
        <button onClick={() => handleVote('F')}>삼척 ({votes.F})</button>
        <button onClick={() => handleVote('G')}>울진 ({votes.G})</button>
        <button onClick={() => handleVote('H')}>영덕 ({votes.H})</button>
        <button onClick={() => handleVote('I')}>포항 ({votes.I})</button>
        <button onClick={() => handleVote('J')}>경주 ({votes.J})</button>
        <button onClick={() => handleVote('K')}>울산 ({votes.K})</button>
        <button onClick={() => handleVote('L')}>부산 ({votes.L})</button>
      </div>

      <button className="vote-todo-Button">투표하기</button>

      <div className="views-container">
        <div className="views-contents">
          <div>사용자프로필</div>
          <span>/사용자닉네임/</span>
          <span>댓글 내용</span>
        </div>

        <form className="views-submit">
          <input type="text"></input>
          <button>입력</button>
        </form>
      </div>
    </div>
  );
}

export default RestaurantVote;
