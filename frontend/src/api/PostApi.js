// src/api/PostApi.js
import axios from 'axios';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // 기본 URL을 /api로 설정
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
        // baseURL이 '/api'이므로, '/posts/'로 경로를 조정합니다.
        const response = await apiClient.get('/posts/', { params }); // params 객체를 사용하여 쿼리 파라미터 전달
        return response.data.data; // 백엔드에서 'data' 키로 게시글 목록을 반환한다고 가정
    } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 특정 게시글 ID로 조회 - **수정된 부분**
 * @param {number} postId - 게시글 ID
 * @returns {Promise<Post>} 게시글 객체
 */
export const fetchPostById = async (postId) => {
    try {
        // baseURL이 '/api'이므로, '/user/posts/${postId}'로 경로를 조정합니다.
        const response = await apiClient.get(`/user/posts/${postId}`);

        // 백엔드 응답이 { status: "success", message: "...", post: PostVO_object } 형태이므로,
        // 실제 post 객체는 response.data.post에 담겨 있습니다.
        if (response.data && response.data.post) {
            return response.data.post;
        } else {
            // 게시글을 찾을 수 없거나 데이터 형식이 예상과 다를 경우 처리
            throw new Error(response.data.message || '게시글을 찾을 수 없습니다.');
        }
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
export const createPost = async (postData, imageFiles) => {
    try {
        const formData = new FormData();
        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' })); // PostVO 데이터를 JSON Blob으로 변환

        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append('images', file); // 이미지 파일 추가
            });
        }

        // baseURL이 '/api'이므로, '/posts/'로 경로를 조정합니다.
        const response = await apiClient.post('/posts/', formData, {
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

        // baseURL이 '/api'이므로, '/posts/${postId}'로 경로를 조정합니다.
        const response = await apiClient.put(`/posts/${postId}`, formData, {
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
        // baseURL이 '/api'이므로, '/posts/${postId}'로 경로를 조정합니다.
        const response = await apiClient.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`게시글 (ID: ${postId}) 삭제 실패:`, error);
        throw error;
    }
};
