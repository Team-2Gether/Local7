import axios from 'axios';

export const fetchUserPostsApi = async (userId, page, pageSize) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}/posts`, {
            params: {
                page: page,
                size: pageSize
            },
            withCredentials: true // 세션 쿠키를 포함하여 요청
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching user posts:", err);
        throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
    }
};