// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: for basic styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">My App</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/signup" className="nav-link">회원가입</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">로그인</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;