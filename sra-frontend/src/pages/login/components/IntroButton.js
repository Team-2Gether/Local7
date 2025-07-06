import React from 'react';
import { useNavigate } from 'react-router-dom';

function IntroButton() {
  const navigate = useNavigate();

  return (
    <button className="intro-button" onClick={() => navigate('/intro')}>
      <span>사이트 소개</span> <span className="go-text">GO</span>
    </button>
  );
}

export default IntroButton;