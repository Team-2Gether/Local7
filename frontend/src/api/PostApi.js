import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/posts'; 
 
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 쿠키 등 인증 정보 포함
});

/**
 * 모든 게시글 조회
 * @returns {Promise<Array<Post>>} 게시글 배열
 */
export const fetchPosts = async () => {
    try {
        const response = await api.get('/');
        // 백엔드 응답 구조에 따라 'data.data' 또는 'data'를 반환
        return response.data.data;
    } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 특정 게시글 ID로 조회
 * @param {number} postId - 게시글 ID
 * @returns {Promise<Post>} 게시글 객체
 */
export const fetchPostById = async (postId) => {
    try {
        const response = await api.get(`/${postId}`);
        return response.data.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 조회 실패:`, error);
        throw error;
    }
};

/**
 * 게시글 생성
 * @param {PostFormData} postData - 생성할 게시글 데이터
 * @returns {Promise<object>} 서버 응답 (메시지, 생성된 게시글 정보 등)
 */
export const createPost = async (postData) => {
    try {
        const response = await api.post('/', postData);
        return response.data;
    } catch (error) {
        console.error('게시글 생성 실패:', error);
        throw error;
    }
};

/**
 * 게시글 업데이트
 * @param {number} postId - 업데이트할 게시글 ID
 * @param {PostFormData} postData - 업데이트할 게시글 데이터
 * @returns {Promise<object>} 서버 응답 (메시지, 업데이트된 게시글 정보 등)
 */
export const updatePost = async (postId, postData) => {
    try {
        const response = await api.put(`/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 업데이트 실패:`, error);
        throw error;
    }
};

/**
 * 게시글 삭제
 * @param {number} postId - 삭제할 게시글 ID
 * @returns {Promise<object>} 서버 응답 (메시지 등)
 */
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 삭제 실패:`, error);
        throw error;
    }
};
