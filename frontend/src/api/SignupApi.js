import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 API 기본 URL
  withCredentials: true, // 필요에 따라 설정 (세션/쿠키 기반 인증 시 사용)
});

/**
 * 중복 확인 API 호출
 * @param {string} field - 중복 확인할 필드 ('login-id', 'email', 'nickname')
 * @param {string} value - 중복 확인할 값
 * @returns {Promise<Object>} - { isDuplicate: boolean } 형태의 응답 데이터
 */
export const checkDuplicate = async (field, value) => {
  try {
    const response = await apiClient.get(`/signup/check-duplicate/${field}/${value}`);
    return response.data;
  } catch (error) {
    console.error(`Error checking duplicate ${field}:`, error);
    throw error;
  }
};

/**
 * 이메일 인증 코드 전송 API 호출
 * @param {string} email - 인증 코드를 전송할 이메일 주소
 * @returns {Promise<Object>} - 백엔드 응답 데이터 (예: { status: 'success', message: '...' })
 */
export const sendEmailVerificationCode = async (email) => {
  try {
    const response = await apiClient.post('/signup/send-email-code', { // 엔드포인트 수정
      email: email,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

/**
 * 이메일 인증 코드 확인 API 호출
 * @param {string} email - 인증 확인을 요청할 이메일 주소
 * @param {string} code - 사용자가 입력한 인증 코드
 * @returns {Promise<Object>} - 백엔드 응답 데이터 (예: { status: 'success', message: '...' })
 */
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await apiClient.post('/signup/verify-email-code', {
      email: email,
      code: code,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error;
  }
};

/**
 * 회원가입 요청 API 호출
 * @param {Object} userData - 회원가입에 필요한 사용자 데이터
 * @returns {Promise<Object>} - 백엔드 응답 데이터 (예: { status: 'success', message: '...' })
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/signup/register', userData); // register 엔드포인트 사용
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
