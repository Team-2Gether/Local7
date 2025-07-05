// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Navbar.css'; // Optional: for basic styling

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userNickname, setUserNickname] = useState(''); // State to store user's nickname
  const navigate = useNavigate(); // Hook for navigation

  // Effect to check login status when the component mounts or updates
  useEffect(() => {
    // In a real application, you'd make an API call to check session status.
    // For simplicity, let's assume we're using localStorage or a context API
    // to manage login state on the client side after the initial login API call.
    // However, the most robust way for session is to check server-side.
    // We'll simulate checking a client-side flag here.

    // A better approach would be to call an API endpoint like /api/user/status
    // to truly check the server-side session.

    // Example of a hypothetical API call to check status:
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user/status'); // Call the new status endpoint
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserNickname(data.userNickname);
        } else {
          setIsLoggedIn(false);
          setUserNickname('');
        }
      } catch (error) {
        console.error("Failed to fetch login status:", error);
        setIsLoggedIn(false);
        setUserNickname('');
      }
    };

    checkLoginStatus();

    // You might also want to set up an event listener or use a context API
    // to update this state globally when login/logout actions occur.
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setIsLoggedIn(false); // Update state to logged out
        setUserNickname(''); // Clear user nickname
        navigate('/login'); // Redirect to login page after logout
      } else {
        alert("로그아웃 실패: " + data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">My App</Link>
      </div>
      <ul className="navbar-nav">
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <span className="nav-link">환영합니다, {userNickname}님!</span>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logout-button">로그아웃</button>
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