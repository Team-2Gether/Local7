// src/pages/notice/Notice.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getNoticeList } from "../../api/NoticeApi";
import NoticeForm from "./NoticeForm";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./Notice.css";

function Notice({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // /notice/:id 접근 시
  const [notices, setNotices] = useState([]);

  const isNew = location.pathname === "/notice/new";
  const isEdit = !!id && location.pathname === `/notice/${id}`;
  const isFormMode = isNew || isEdit;

  useEffect(() => {
    if (!isFormMode) loadNotices();
  }, [location.pathname]);

  const loadNotices = async () => {
    try {
      const data = await getNoticeList();
      setNotices(Array.isArray(data) ? data.filter((n) => n !== null) : []);
    } catch (error) {
      console.error("공지사항 불러오기 실패:", error);
      setNotices([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  const handleSidebarClick = (item) => {
    if (item === "home") navigate("/");
    else if (item === "restaurants") navigate("/restaurants");
    else if (item === "posts") navigate("/posts");
    else if (item === "add") navigate("/posts/new");
    else if (item === "mypage") navigate("/mypage");
    else if (item === "pick") navigate("/pick");
    else if (item === "notice") navigate("/notice");
  };

  return (
    <div className="app-layout">
      <div className="navbar-container">
        <Navbar
          isLoggedIn={true}
          userNickname={currentUser?.userNickname}
          onLogout={() => {}}
        />
      </div>

      <div className="main-content-area">
        <div className="sidebar-container">
          <Sidebar onMenuItemClick={handleSidebarClick} />
        </div>

        <div className="content-container">
          {isFormMode ? (
            <>
              <h2>{isNew ? "공지사항 등록" : "공지사항 수정"}</h2>
              <NoticeForm currentUser={currentUser} />
            </>
          ) : (
            <>
              <h2>공지사항</h2>
              {currentUser?.ruleId === 1 && (
                <div className="notice-header">
                  <button
                    className="btn-write"
                    onClick={() => navigate("/notice/new")}
                  >
                    글쓰기
                  </button>
                </div>
              )}
              <table className="notice-table">
                <thead>
                  <tr>
                    <th className="notice-col-id">번호</th>
                    <th>제목</th>
                    <th className="notice-col-writer">작성자</th>
                    <th className="notice-col-date">작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice, index) => (
                    <tr
                      key={notice.noticeId}
                      onClick={() => navigate(`/notice/${notice.noticeId}`)}
                      className="notice-row"
                    >
                      {/* 번호: 아래가 1번, 위로 갈수록 번호 커짐 */}
                      <td className="notice-col-id">
                        {notices.length - index}
                      </td>
                      <td>{notice.noticeTitle}</td>
                      <td className="notice-col-writer">{notice.createdId}</td>
                      <td className="notice-col-date">
                        {notice.createdDate
                          ? new Date(notice.createdDate).toLocaleDateString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notice;
