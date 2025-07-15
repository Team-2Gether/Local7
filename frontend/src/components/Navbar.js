// src/components/Navbar.js
import React from 'react'; // useEffect, useState 제거
import { Link } from 'react-router-dom'; // useNavigate 제거
import '../assets/css/Navbar.css';

// Navbar는 isLoggedIn, userNickname, onLogout prop을 받습니다.
function Navbar({ isLoggedIn, userNickname, onLogout }) {
  // 이제 Navbar는 자체적으로 로그인 상태를 관리하지 않고 prop으로 받습니다.
  // 따라서 내부의 useState와 useEffect는 제거합니다.

  return (
    <nav className="navbar">
     <div className="navbar-brand">
        <Link to="/">
          <span className="local">LOCAL</span>
          <span className="r7">R7</span>
        </Link>
      </div>
      <ul className="navbar-nav">
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <span className="nav-link">환영합니다, {userNickname}님!</span>
            </li>
            <li className="nav-item">
              <button onClick={onLogout} className="nav-link logout-button">로그아웃</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">회원가입</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">로그인</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;