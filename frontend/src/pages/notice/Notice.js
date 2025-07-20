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
import "./Notice.css"; // CSS 파일은 그대로 유지

function Notice({ currentUser, onMenuItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
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


  return (
    <div className="content-container">
      <Routes>
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
                      onClick={() =>
                        navigate(`/notice/${notice.noticeId}`)
                      }
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

        <Route
          path="new"
          element={
            <>
              <h2>공지사항 등록</h2>
              <NoticeForm currentUser={currentUser} />
            </>
          }
        />

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
  );
}

export default Notice;