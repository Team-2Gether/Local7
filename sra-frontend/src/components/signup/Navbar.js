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
        {/* Other navigation items */}
        <li className="nav-item">
          <Link to="/signup" className="nav-link">회원가입</Link>
        </li>
        {/* You can add a login button here later */}
      </ul>
    </nav>
  );
}

export default Navbar;