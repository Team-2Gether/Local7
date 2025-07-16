// src/api/PostApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/posts';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 쿠키 등 인증 정보 포함
});

/**
 * 모든 게시글 조회
 * @param {string} [sortBy] - 정렬 기준 ('latest', 'likes', 'comments'). 선택 사항.
 * @returns {Promise<Array<Post>>} 게시글 배열
 */
export const fetchPosts = async (sortBy) => { // sortBy 파라미터 추가
    try {
        const params = {};
        if (sortBy) { // sortBy 값이 있을 경우에만 파라미터에 추가
            params.sortBy = sortBy;
        }
        const response = await api.get('/', { params }); // params 객체를 사용하여 쿼리 파라미터 전달
        return response.data.data; // 백엔드에서 'data' 키로 게시글 목록을 반환한다고 가정
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
 * 게시글 생성 (이미지 파일 포함)
 * @param {object} postData - 생성할 게시글 데이터 (JSON 객체)
 * @param {File[]} imageFiles - 이미지 파일 배열
 * @returns {Promise<object>} 서버 응답 (메시지, 생성된 게시글 정보 등)
 */
export const createPost = async (postData, imageFiles = []) => {
    try {
        const formData = new FormData();
        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' })); // PostVO 데이터를 JSON Blob으로 변환

        imageFiles.forEach((file) => {
            formData.append('images', file); // 이미지 파일 추가
        });

        const response = await api.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 중요: multipart/form-data로 설정
            },
        });
        return response.data;
    } catch (error) {
        console.error('게시글 생성 실패:', error);
        throw error;
    }
};

/**
 * 게시글 업데이트 (이미지 파일 포함)
 * @param {number} postId - 업데이트할 게시글 ID
 * @param {object} postData - 업데이트할 게시글 데이터 (JSON 객체)
 * @param {File[]} newImageFiles - 새로 추가할 이미지 파일 배열
 * @returns {Promise<object>} 서버 응답 (메시지, 업데이트된 게시글 정보 등)
 */
export const updatePost = async (postId, postData, newImageFiles = []) => {
    try {
        const formData = new FormData();
        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' })); // PostVO 데이터를 JSON Blob으로 변환

        newImageFiles.forEach((file) => {
            formData.append('images', file); // 새로운 이미지 파일 추가
        });

        const response = await api.put(`/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 중요: multipart/form-data로 설정
            },
        });
        return response.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 업데이트 실패:`, error);
        throw error;
    }
};

/**
 * 게시글 삭제
 * @param {number} postId - 삭제할 게시글 ID
 * @returns {Promise<object>} 서버 응답 (메시지)
 */
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/${postId}`); // postId만 전달
        return response.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 삭제 실패:`, error);
        throw error;
    }
};