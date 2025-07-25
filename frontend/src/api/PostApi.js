import axios from 'axios';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://192.168.0.10:8080/api', // 기본 URL을 /api로 설정
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
 * 파일 객체를 Base64 문자열로 변환하는 헬퍼 함수
 * @param {File} file - 변환할 파일 객체
 * @returns {Promise<string>} Base64 문자열 (prefix 제외)
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 파일을 Data URL (Base64)로 읽기
        reader.onload = () => {
            // "data:image/jpeg;base64,"와 같은 prefix를 제거하고 순수 Base64 문자열만 반환
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
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
        // PostVO 데이터를 JSON Blob으로 변환하여 'post' 파트에 추가
        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

        if (imageFiles && imageFiles.length > 0) {
            const base64Images = await Promise.all(
                imageFiles.map(file => fileToBase64(file))
            );
            base64Images.forEach(base64String => {
                formData.append('images', base64String);
                console.log("Adding Base64 to FormData (first 50 chars):", base64String.substring(0, Math.min(base64String.length, 50)) + "...");
            });
        } else {
            console.log("No image files selected for upload.");
        }

        const response = await apiClient.post('/posts/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 여전히 FormData를 사용하므로 유지
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
        // PostVO 데이터를 JSON Blob으로 변환하여 'post' 파트에 추가
        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

        if (newImageFiles && newImageFiles.length > 0) {
            // 각 이미지 파일을 Base64 문자열로 변환하여 'images' 파트에 추가
            const base64Images = await Promise.all(
                newImageFiles.map(file => fileToBase64(file))
            );
            base64Images.forEach(base64String => {
                formData.append('images', base64String); // Base64 문자열을 추가
            });
        }

        const response = await apiClient.put(`/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 여전히 FormData를 사용하므로 유지
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

/**
 * 게시글 신고
 * @param {number} postId - 신고할 게시글 ID
 * @param {string} reportReason - 신고 사유
 */
export const reportPost = async (postId, reportReason) => {
    try {
        const response = await apiClient.post(`/posts/${postId}/report`, {
            reportReason: reportReason,
            // reportType: 'post'와 targetId는 백엔드에서 설정되므로, 여기서는 reportReason만 보냅니다.
        });
        return response.data;
    } catch (error) {
        console.error('게시글 신고 실패:', error);
        throw error;
    }
};