// src/api/NoticeApi.js
import axios from "axios";

// 백엔드 주소
const API_BASE = "http://localhost:8080/notice";

// 공지사항 목록 가져오기
export const getNoticeList = async () => {
  const response = await axios.get(`${API_BASE}/list`);
  return response.data;
};

// 공지사항 단건 조회 (수정용)
export const getNotice = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

// 공지사항 등록
export const saveNotice = async (notice) => {
  await axios.post(`${API_BASE}/add`, notice);
};

// 공지사항 수정
export const updateNotice = async (notice) => {
  await axios.put(`${API_BASE}/update`, notice);
};

// 공지사항 삭제
export const deleteNotice = async (id) => {
  await axios.delete(`${API_BASE}/delete/${id}`);
};
