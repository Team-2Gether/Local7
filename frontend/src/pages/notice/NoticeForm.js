// src/pages/notice/NoticeForm.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNotice,
  saveNotice,
  updateNotice,
  deleteNotice,
} from "../../api/NoticeApi";

function NoticeForm({ currentUser }) {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정 시 id 있음
  const isEdit = !!id;

  //  로그 찍기
  console.log("NoticeForm 렌더링됨");
  console.log("currentUser:", currentUser);
  console.log("isEdit:", isEdit);

  //  관리자 권한이 아니면 접근 차단
  useEffect(() => {
    if (!currentUser || currentUser.ruleId !== 1) {
      alert("관리자만 접근 가능합니다.");
      navigate("/notice");
    }
  }, [currentUser, navigate]);

  const [notice, setNotice] = useState({
    noticeTitle: "",
    noticeContent: "",
    userId: currentUser?.userId || "",
    createdId: currentUser?.userNickname || "",
    updatedId: currentUser?.userNickname || "",
  });

  useEffect(() => {
    if (isEdit) {
      loadNotice();
    }
  }, [id]);

  const loadNotice = async () => {
    try {
      const data = await getNotice(id);
      setNotice(data);
    } catch (error) {
      console.error("공지사항 로딩 실패:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateNotice(notice);
        alert("공지사항이 수정되었습니다.");
      } else {
        await saveNotice(notice);
        alert("공지사항이 등록되었습니다.");
      }
      navigate("/notice");
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        alert("공지사항이 삭제되었습니다.");
        navigate("/notice");
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  return (
    <div className="content-container">
      <table className="notice-form-table">
        <tbody>
          <tr>
            <td>제목</td>
            <td>
              <input
                type="text"
                name="noticeTitle"
                value={notice.noticeTitle}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td>본문</td>
            <td>
              <textarea
                name="noticeContent"
                value={notice.noticeContent}
                onChange={handleChange}
                rows="15"
                style={{ width: "100%" }}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td>첨부파일</td>
            <td>
              <input type="file" disabled />
              <span> (파일 기능 미구현)</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="btn-write" onClick={handleSubmit}>
          {isEdit ? "수정" : "등록"}
        </button>

        {isEdit && (
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              marginLeft: "10px",
              padding: "6px 12px",
              borderRadius: "20px",
            }}
          >
            삭제
          </button>
        )}

        <button
          onClick={() => navigate("/notice")}
          style={{
            marginLeft: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
          }}
        >
          목록
        </button>
      </div>
    </div>
  );
}

export default NoticeForm;
