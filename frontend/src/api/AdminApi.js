import axios from 'axios';

// API 클라이언트 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/admin', // 관리자 API의 공통 경로 설정
    withCredentials: true, // 세션 쿠키를 포함하여 요청을 보냄
});

// 각 API 호출 시 X-USER-ID 헤더를 동적으로 추가하기 위해 인터셉터 대신 함수 매개변수로 받도록 변경

export const AdminApi = {
    /**
     * 모든 사용자 목록을 가져옵니다.
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Array>} 사용자 목록 배열
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    getUsers: async (adminId) => {
        try {
            const response = await apiClient.get('/users', {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error('사용자 목록을 불러오는 데 실패했습니다:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 특정 사용자를 삭제합니다.
     * @param {number} userId - 삭제할 사용자의 ID
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Object>} 삭제 성공 메시지 또는 데이터
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    deleteUser: async (userId, adminId) => {
        try {
            const response = await apiClient.delete(`/users/${userId}`, {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error(`사용자 (ID: ${userId}) 삭제에 실패했습니다:`, error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 모든 게시글 목록을 가져옵니다.
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Array>} 게시글 목록 배열
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    getPosts: async (adminId) => {
        try {
            const response = await apiClient.get('/posts', {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error('게시글 목록을 불러오는 데 실패했습니다:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 특정 게시글을 삭제합니다.
     * @param {number} postId - 삭제할 게시글의 ID
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Object>} 삭제 성공 메시지 또는 데이터
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    deletePost: async (postId, adminId) => {
        try {
            const response = await apiClient.delete(`/posts/${postId}`, {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error(`게시글 (ID: ${postId}) 삭제에 실패했습니다:`, error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 모든 댓글 목록을 가져옵니다.
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Array>} 댓글 목록 배열
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    getComments: async (adminId) => {
        try {
            const response = await apiClient.get('/comments', {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error('댓글 목록을 불러오는 데 실패했습니다:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 특정 댓글을 삭제합니다.
     * @param {number} commentId - 삭제할 댓글의 ID
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Object>} 삭제 성공 메시지 또는 데이터
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    deleteComment: async (commentId, adminId) => {
        try {
            const response = await apiClient.delete(`/comments/${commentId}`, {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error(`댓글 (ID: ${commentId}) 삭제에 실패했습니다:`, error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 모든 리뷰 목록을 가져옵니다.
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Array>} 리뷰 목록 배열
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    getReviews: async (adminId) => {
        try {
            const response = await apiClient.get('/reviews', {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error('리뷰 목록을 불러오는 데 실패했습니다:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 특정 리뷰를 삭제합니다.
     * @param {number} reviewId - 삭제할 리뷰의 ID
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Object>} 삭제 성공 메시지 또는 데이터
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    deleteReview: async (reviewId, adminId) => {
        try {
            const response = await apiClient.delete(`/reviews/${reviewId}`, {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error(`리뷰 (ID: ${reviewId}) 삭제에 실패했습니다:`, error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 모든 신고 목록을 가져옵니다. (항상 최신순으로 정렬)
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Array>} 신고 목록 배열
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    getReports: async (adminId) => {
        try {
            const response = await apiClient.get('/reports', {
                params: { sortBy: 'latest' },
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error('신고 목록을 불러오는 데 실패했습니다:', error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    /**
     * 특정 신고의 상태를 업데이트합니다.
     * @param {number} reportId - 상태를 업데이트할 신고의 ID
     * @param {string} newStatus - 새로운 신고 상태 ('PENDING' 또는 'COMPLETED')
     * @param {string} adminId - 관리자 자신의 userId (X-USER-ID 헤더에 사용)
     * @returns {Promise<Object>} 업데이트 성공 메시지 또는 데이터
     * @throws {Error} API 호출 실패 시 에러 발생
     */
    updateReportStatus: async (reportId, newStatus, adminId) => {
        try {
            const response = await apiClient.patch(`/reports/${reportId}/status`, { status: newStatus }, {
                headers: { 'X-USER-ID': adminId }
            });
            return response.data;
        } catch (error) {
            console.error(`신고 (ID: ${reportId}) 상태 업데이트에 실패했습니다:`, error);
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },
};
