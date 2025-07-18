// src/api/NoticeApi.js
import axios from "axios";

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 기본 URL을 /api로 설정
  withCredentials: true,
});

// 공지사항 목록 가져오기
export const getNoticeList = async () => {
  // baseURL이 '/api'이므로, '/notice/list'로 경로를 조정합니다.
  const response = await apiClient.get(`/notice/list`);
  return response.data;
};

// 공지사항 단건 조회 (수정용)
export const getNotice = async (id) => {
  // baseURL이 '/api'이므로, '/notice/${id}'로 경로를 조정합니다.
  const response = await apiClient.get(`/notice/${id}`);
  return response.data;
};

// 공지사항 등록
export const saveNotice = async (notice) => {
  // baseURL이 '/api'이므로, '/notice/add'로 경로를 조정합니다.
  await apiClient.post(`/notice/add`, notice);
};

// 공지사항 수정
export const updateNotice = async (notice) => {
  // baseURL이 '/api'이므로, '/notice/update'로 경로를 조정합니다.
  await apiClient.put(`/notice/update`, notice);
};

// 공지사항 삭제
export const deleteNotice = async (id) => {
  // baseURL이 '/api'이므로, '/notice/delete/${id}'로 경로를 조정합니다.
  await apiClient.delete(`/notice/delete/${id}`);
};
