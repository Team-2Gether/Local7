import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

export const loginUser = async (credential, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      credential,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
};
