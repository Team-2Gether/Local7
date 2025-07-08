import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 기본 URL 설정
  withCredentials: true, // 필요에 따라 설정
});

// 중복 확인 API 함수
export const checkDuplicate = async (field, value) => {
  try {
    const response = await apiClient.get(`/signup/check-duplicate/${field}/${value}`);
    return response.data; // { isDuplicate: boolean } 형태를 반환할 것으로 예상
  } catch (error) {
    console.error(`Error checking duplicate ${field}:`, error);
    throw error; // 에러를 호출한 쪽으로 다시 던져서 처리
  }
};

// 이메일 인증 코드 전송 API 함수
export const sendEmailVerificationCode = async (email) => {
  try {
    const response = await apiClient.post('/signup/send-email-code', {
      email: email,
    });
    return response.data; // { status: 'success' | 'fail', message: string } 형태를 반환할 것으로 예상
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

// 이메일 인증 코드 확인 API 함수
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await apiClient.post('/signup/verify-email-code', {
      email: email,
      code: code,
    });
    return response.data; // { status: 'success' | 'fail', message: string } 형태를 반환할 것으로 예상
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error;
  }
};

// 회원가입 요청 API 함수
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/signup/register', userData);
    return response.data; // { message: string } 형태를 반환할 것으로 예상
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};