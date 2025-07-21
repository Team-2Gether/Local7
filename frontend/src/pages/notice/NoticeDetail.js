import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotice } from "../../api/NoticeApi";

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getNotice(id);
        setNotice(data);
      } catch (error) {
        console.error("공지사항 조회 실패:", error);
      }
    };
    fetchNotice();
  }, [id]);

  if (!notice) return <p>로딩 중...</p>;

  return (
    <div className="content-container">
      <table className="notice-form-table">
        <tbody>
          <tr>
            <td>제목</td>
            <td>{notice.noticeTitle}</td>
          </tr>
          <tr>
            <td>본문</td>
            <td>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {notice.noticeContent}
              </pre>
            </td>
          </tr>
          <tr>
            <td>작성자</td>
            <td>{notice.createdId}</td>
          </tr>
          <tr>
            <td>작성일</td>
            <td>
              {notice.createdDate
                ? new Date(notice.createdDate).toLocaleDateString()
                : ""}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="notice-form-buttons">
        <button className="btn-cancel" onClick={() => navigate("/notice")}>
          목록
        </button>
      </div>
    </div>
  );
}

export default NoticeDetail;
