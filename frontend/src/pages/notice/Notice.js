// src/pages/notice/Notice.js
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { getNoticeList } from "../../api/NoticeApi";
import NoticeForm from "./NoticeForm";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./Notice.css";

function Notice({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (location.pathname === "/notice") {
      loadNotices();
    }
  }, [location.pathname]);

  const loadNotices = async () => {
    try {
      const data = await getNoticeList();
      setNotices(Array.isArray(data) ? data.filter((n) => n !== null) : []);
    } catch (error) {
      console.error("공지사항 불러오기 실패:", error);
      setNotices([]);
    }
  };

  const handleSidebarClick = (item) => {
    const routes = {
      home: "/",
      restaurants: "/restaurants",
      posts: "/posts",
      add: "/posts/new",
      mypage: "/mypage",
      pick: "/pick",
      notice: "/notice",
    };
    if (routes[item]) navigate(routes[item]);
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
          <Routes>
            {/* 공지사항 목록 */}
            <Route
              path=""
              element={
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
                          <td className="notice-col-id">
                            {notices.length - index}
                          </td>
                          <td>{notice.noticeTitle}</td>
                          <td className="notice-col-writer">
                            {notice.createdId}
                          </td>
                          <td className="notice-col-date">
                            {notice.createdDate
                              ? new Date(
                                  notice.createdDate
                                ).toLocaleDateString()
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              }
            />

            {/* 공지사항 등록 */}
            <Route
              path="new"
              element={
                <>
                  <h2>공지사항 등록</h2>
                  <NoticeForm currentUser={currentUser} />
                </>
              }
            />

            {/* 공지사항 수정 */}
            <Route
              path=":id"
              element={
                <>
                  <h2>공지사항 수정</h2>
                  <NoticeForm currentUser={currentUser} />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Notice;
