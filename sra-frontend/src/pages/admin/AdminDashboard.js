// src/pages/admin/AdminDashboard.js
import React from 'react';

function AdminDashboard({ currentUser }) {
  return (
    <div className="admin-dashboard">
      <h2>관리자 대시보드</h2>
      {currentUser && (
        <p>환영합니다, 관리자 {currentUser.userNickname}님!</p>
      )}
      <p>이곳은 관리자 전용 페이지입니다.</p>
      {/* 여기에 관리자 기능 및 콘텐츠를 추가하세요 */}
      <ul>
        <li>사용자 관리</li>
        <li>게시판 관리</li>
        <li>시스템 설정</li>
      </ul>
    </div>
  );
}

export default AdminDashboard;