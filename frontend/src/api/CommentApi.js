import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

const commentsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 세션 쿠키를 포함하여 요청을 보냄
});

export const fetchComments = async (postId) => {
  try {
    const response = await commentsApi.get(`/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('댓글을 불러오는 데 실패했습니다:', error);
    throw error;
  }
};

export const createComment = async (postId, content) => {
  try {
    const response = await commentsApi.post(`/api/posts/${postId}/comments`, { content });
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
    const response = await commentsApi.put(`/api/posts/${postId}/comments/${commentId}`, { content });
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
    const response = await commentsApi.delete(`/api/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제에 실패했습니다:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};