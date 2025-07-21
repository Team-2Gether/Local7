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
import NoticeDetail from "./NoticeDetail";
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
                      onClick={() => navigate(`/notice/${notice.noticeId}`)}
                      className="notice-row"
                    >
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
          }
        />

        <Route
          path="new"
          element={
            currentUser?.ruleId === 1 ? (
              <>
                <h2>공지사항 등록</h2>
                <NoticeForm currentUser={currentUser} />
              </>
            ) : (
              <h2>권한이 없습니다.</h2>
            )
          }
        />

        <Route
          path=":id"
          element={
            currentUser?.ruleId === 1 ? (
              <>
                <h2>공지사항 수정</h2>
                <NoticeForm currentUser={currentUser} />
              </>
            ) : (
              <>
                <h2>공지사항</h2>
                <NoticeDetail />
              </>
            )
          }
        />
      </Routes>

      <div className="customer-support-box">
        <h3>고객센터 문의</h3>
        <p>
          이용 중 궁금하신 점이 있다면
          <br />
          abcd1010@local.com<br></br>으로 문의 주시면 됩니다.
        </p>
        <p>
          예시:<br></br>
          Q:안녕하세요! 혹시 포항 구룡포 쪽 맛집도 등록 계획 있으신가요?제가
          직접 가본 집이 있는데 공유하고 싶어서요.<br></br>
          <br></br>
        </p>
        Q: 가게 사장님인데 우리 가게도 사이트에 등록하고 싶어요. 비용이
        발생하나요?<br></br>
        <br></br>
        Q: 해킹을 당했는데 어떻게 해야 하나요?<br></br>
        <br></br>
      </div>
    </div>
  );
}

export default Notice;
