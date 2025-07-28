import axios from 'axios';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // 세션 쿠키를 포함하여 요청을 보냄
});

// (수정) sortOrder 매개변수 추가 및 쿼리 파라미터로 전달
export const fetchComments = async (postId, sortOrder = 'latest') => { // (수정) 기본값 'latest' 추가
  try {
    // baseURL이 '/api'로 변경되었으므로, 경로에서 '/api'를 제거합니다.
    const response = await apiClient.get(`/posts/${postId}/comments`, {
      params: { sort: sortOrder } // (추가) 정렬 기준을 쿼리 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error('댓글을 불러오는 데 실패했습니다:', error);
    throw error;
  }
};

export const createComment = async (postId, content) => {
  try {
    // baseURL이 '/api'로 변경되었으므로, 경로에서 '/api'를 제거합니다.
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('댓글 작성에 실패했습니다:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

export const updateComment = async (postId, commentId, content) => {
  try {
    // baseURL이 '/api'로 변경되었으므로, 경로에서 '/api'를 제거합니다.
    const response = await apiClient.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('댓글 수정에 실패했습니다:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    // baseURL이 '/api'로 변경되었으므로, 경로에서 '/api'를 제거합니다.
    const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제에 실패했습니다:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

// 댓글 좋아요 토글 API 호출 함수
export const toggleLikeComment = async (commentId, userId) => {
  try {
    // baseURL이 '/api'로 변경되었으므로, 경로에서 '/api'를 제거합니다.
    const response = await apiClient.post(`/comments/${commentId}/like`, { userId });
    return response.data;
  } catch (error) {
    console.error('댓글 좋아요 토글에 실패했습니다:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || '좋아요 처리 실패');
    }
    throw error;
  }
};

export const reportComment = async (commentId, reportReason) => {
  try {
    const response = await apiClient.post(
      `/comments/${commentId}/report`,
      { reportReason }
    );
    return response.data;
  } catch (error) {
    console.error('댓글 신고 실패:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || '댓글 신고에 실패했습니다.');
    }
    throw error;
  }
};