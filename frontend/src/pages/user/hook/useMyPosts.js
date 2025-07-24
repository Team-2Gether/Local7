import { useState, useEffect } from 'react';
import { fetchUserPostsApi } from '../../../api/myPostsApi'; // 분리된 API 함수 import

export const useMyPosts = (userId, pageSize) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        if (userId) {
            const fetchPosts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchUserPostsApi(userId, page, pageSize);
                    if (data.status === "success") {
                        const paginationData = data.pagination;
                        setPosts(paginationData.content);
                        setTotalPages(paginationData.totalPages);
                        setTotalElements(paginationData.totalElements);
                    } else {
                        setError(data.message || "게시글을 불러오는 데 실패했습니다.");
                    }
                } catch (err) {
                    setError(err.message || "게시글을 불러오는 중 오류가 발생했습니다.");
                } finally {
                    setLoading(false);
                }
            };
            fetchPosts();
        } else {
            setLoading(false);
            setError("사용자 ID를 불러올 수 없습니다. 로그인 상태를 확인해주세요.");
        }
    }, [page, userId, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return {
        posts,
        loading,
        error,
        page,
        totalPages,
        totalElements,
        handlePageChange
    };
};