// useAdmin.js 파일 수정
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../../../api/AdminApi'; // AdminApi 경로 확인

const useAdmin = (currentUser) => {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 항목 수

    // RestaurantDetailModal 관련 상태 추가
    const [isRestaurantDetailModalOpen, setIsRestaurantDetailModalOpen] = useState(false);
    const [selectedRestaurantForModal, setSelectedRestaurantForModal] = useState(null);

    const navigate = useNavigate();

    const ADMIN_ID = currentUser?.userId;

    // 데이터를 가져오는 함수 (페이지네이션 파라미터 추가)
    const fetchAdminData = useCallback(async (page, size) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: fetchAdminData 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---

        if (!ADMIN_ID) {
            setError("관리자 ID를 알 수 없습니다. 로그인 상태를 확인해주세요."); // 더 구체적인 에러 메시지
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let data;
            switch (activeTab) {
                case "users":
                    data = await AdminApi.getUsers(ADMIN_ID, page, size);
                    // data.content가 유효한 배열인지 확인
                    setUsers(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(data?.totalPages || 0);
                    break;
                case "posts":
                    data = await AdminApi.getPosts(ADMIN_ID, page, size);
                    setPosts(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(data?.totalPages || 0);
                    break;
                case "comments":
                    data = await AdminApi.getComments(ADMIN_ID, page, size);
                    setComments(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(data?.totalPages || 0);
                    break;
                case "reviews":
                    data = await AdminApi.getReviews(ADMIN_ID, page, size);
                    setReviews(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(data?.totalPages || 0);
                    break;
                case "reports":
                    data = await AdminApi.getReports(ADMIN_ID, page, size);
                    setReports(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(data?.totalPages || 0);
                    break;
                default:
                    setUsers([]);
                    setPosts([]);
                    setComments([]);
                    setReviews([]);
                    setReports([]);
                    setTotalPages(0);
                    break;
            }
        } catch (err) {
            setError(err.message || "데이터를 불러오는 데 실패했습니다.");
            console.error(err);
            // 에러 발생 시 데이터 목록을 비워줍니다.
            setUsers([]);
            setPosts([]);
            setComments([]);
            setReviews([]);
            setReports([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [activeTab, ADMIN_ID, itemsPerPage]); // itemsPerPage도 의존성 배열에 추가

    // 탭 또는 페이지 변경 시 데이터 다시 불러오기
    useEffect(() => {
        setCurrentPage(0); // 탭 변경 시 현재 페이지를 0으로 초기화
        fetchAdminData(0, itemsPerPage);
    }, [activeTab, fetchAdminData, itemsPerPage]);

    // 페이지 변경 핸들러
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        fetchAdminData(newPage, itemsPerPage);
    }, [fetchAdminData, itemsPerPage]);

    // 각 목록의 삭제 핸들러들은 AdminApi.js의 변경된 파라미터에 맞게 adminId를 추가합니다.
    const handleDeleteUser = useCallback(async (userId, nickname) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleDeleteUser 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---
        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 사용자 삭제를 진행할 수 없습니다.");
            return;
        }
        if (window.confirm(`${nickname} 사용자를 정말로 삭제하시겠습니까?`)) {
            try {
                await AdminApi.deleteUser(userId, ADMIN_ID); // adminId 추가
                alert(`${nickname} 사용자가 삭제되었습니다.`);
                fetchAdminData(currentPage, itemsPerPage); // 삭제 후 현재 페이지 데이터 새로고침
            } catch (err) {
                alert(`사용자 삭제 실패: ${err.message}`);
            }
        }
    }, [ADMIN_ID, fetchAdminData, currentPage, itemsPerPage]);

    const handleDeletePost = useCallback(async (postId) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleDeletePost 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---
        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 게시글 삭제를 진행할 수 없습니다.");
            return;
        }
        if (window.confirm("이 게시글을 정말로 삭제하시겠습니까?")) {
            try {
                await AdminApi.deletePost(postId, ADMIN_ID); // adminId 추가
                alert("게시글이 삭제되었습니다.");
                fetchAdminData(currentPage, itemsPerPage); // 삭제 후 현재 페이지 데이터 새로고침
            } catch (err) {
                alert(`게시글 삭제 실패: ${err.message}`);
            }
        }
    }, [ADMIN_ID, fetchAdminData, currentPage, itemsPerPage]);

    const handleDeleteComment = useCallback(async (commentId) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleDeleteComment 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---
        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 댓글 삭제를 진행할 수 없습니다.");
            return;
        }
        if (window.confirm("이 댓글을 정말로 삭제하시겠습니까?")) {
            try {
                await AdminApi.deleteComment(commentId, ADMIN_ID); // adminId 추가
                alert("댓글이 삭제되었습니다.");
                fetchAdminData(currentPage, itemsPerPage); // 삭제 후 현재 페이지 데이터 새로고침
            } catch (err) {
                alert(`댓글 삭제 실패: ${err.message}`);
            }
        }
    }, [ADMIN_ID, fetchAdminData, currentPage, itemsPerPage]);

    const handleDeleteReview = useCallback(async (reviewId) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleDeleteReview 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---
        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 리뷰 삭제를 진행할 수 없습니다.");
            return;
        }
        if (window.confirm("이 리뷰를 정말로 삭제하시겠습니까?")) {
            try {
                await AdminApi.deleteReview(reviewId, ADMIN_ID); // adminId 추가
                alert("리뷰가 삭제되었습니다.");
                fetchAdminData(currentPage, itemsPerPage); // 삭제 후 현재 페이지 데이터 새로고침
            } catch (err) {
                alert(`리뷰 삭제 실패: ${err.message}`);
            }
        }
    }, [ADMIN_ID, fetchAdminData, currentPage, itemsPerPage]);

    const handleUpdateReportStatus = useCallback(async (reportId, newStatus) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleUpdateReportStatus 호출 시 ADMIN_ID:", ADMIN_ID);
        // --- 여기까지 ---
        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 신고 상태 업데이트를 진행할 수 없습니다.");
            return;
        }
        try {
            await AdminApi.updateReportStatus(reportId, newStatus, ADMIN_ID); // adminId 추가
            alert("신고 상태가 업데이트되었습니다.");
            fetchAdminData(currentPage, itemsPerPage); // 업데이트 후 현재 페이지 데이터 새로고침
        } catch (err) {
            alert(`신고 상태 업데이트 실패: ${err.message}`);
        }
    }, [ADMIN_ID, fetchAdminData, currentPage, itemsPerPage]);

    // handleRowClick 함수 업데이트
    // 이제 restaurantId를 세 번째 인자로 받을 수 있도록 변경
    const handleRowClick = useCallback(async (id, type, restaurantId = null) => {
        // --- 디버깅을 위한 로그 추가 ---
        console.log("DEBUG: handleRowClick 호출 시 ADMIN_ID:", ADMIN_ID);
        console.log("DEBUG: handleRowClick 호출 시 restaurantId:", restaurantId);
        // --- 여기까지 ---

        if (!ADMIN_ID) {
            alert("관리자 ID를 알 수 없어 상세 정보를 볼 수 없습니다.");
            return;
        }

        if (type === "review" && restaurantId) {
            try {
                // AdminApi 호출 시에도 ADMIN_ID가 유효한지 확인하고 전달
                const restaurantData = await AdminApi.getRestaurantById(restaurantId, ADMIN_ID);
                setSelectedRestaurantForModal(restaurantData);
                setIsRestaurantDetailModalOpen(true);
            } catch (err) {
                alert(`음식점 정보 불러오기 실패: ${err.message}`);
                console.error("Failed to fetch restaurant details:", err);
            }
        } else {
            let path = '';
            switch (type) {
                case "user":
                    path = `/admin/user-detail/${id}`;
                    break;
                case "post":
                    path = `/admin/post-detail/${id}`;
                    break;
                case "comment":
                    path = `/admin/comment-detail/${id}`;
                    break;
                case "report":
                    path = `/admin/report-detail/${id}`;
                    break;
                default:
                    return;
            }
            navigate(path);
        }
    }, [navigate, ADMIN_ID]);

    // 모달 닫기 핸들러
    const closeRestaurantDetailModal = useCallback(() => {
        setIsRestaurantDetailModalOpen(false);
        setSelectedRestaurantForModal(null);
    }, []);

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.userLoginId && user.userLoginId.toLowerCase().includes(lowercasedSearchTerm)) ||
            (user.userNickname && user.userNickname.toLowerCase().includes(lowercasedSearchTerm)) ||
            (user.userEmail && user.userEmail.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [users, lowercasedSearchTerm]);

    const filteredPosts = useMemo(() => {
        if (!searchTerm) return posts;
        return posts.filter(post =>
            (post.postTitle && post.postTitle.toLowerCase().includes(lowercasedSearchTerm)) ||
            (post.userNickname && post.userNickname.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [posts, lowercasedSearchTerm]);

    const filteredComments = useMemo(() => {
        if (!searchTerm) return comments;
        return comments.filter(comment =>
            (comment.content && comment.content.toLowerCase().includes(lowercasedSearchTerm)) ||
            (comment.userNickname && comment.userNickname.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [comments, lowercasedSearchTerm]);

    const filteredReviews = useMemo(() => {
        if (!searchTerm) return reviews;
        return reviews.filter(review =>
            (review.reviewContent && review.reviewContent.toLowerCase().includes(lowercasedSearchTerm)) ||
            (review.userNickname && review.userNickname.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [reviews, lowercasedSearchTerm]);

    const filteredReports = useMemo(() => {
        if (!searchTerm) return reports;
        return reports.filter(report => {
            const reportTitleMatch = report.reportType === 'post' && report.postTitle && report.postTitle.toLowerCase().includes(lowercasedSearchTerm);
            const reviewContentMatch = report.reportType === 'review' && report.reviewContent && report.reviewContent.toLowerCase().includes(lowercasedSearchTerm);
            const commentContentMatch = report.reportType === 'comment' && report.commentContent && report.commentContent.toLowerCase().includes(lowercasedSearchTerm);

            return (
                reportTitleMatch ||
                reviewContentMatch ||
                commentContentMatch ||
                (report.reportReason && report.reportReason.toLowerCase().includes(lowercasedSearchTerm)) ||
                (report.reporterNickname && report.reporterNickname.toLowerCase().includes(lowercasedSearchTerm)) ||
                (report.targetNickname && report.targetNickname.toLowerCase().includes(lowercasedSearchTerm))
            );
        });
    }, [reports, lowercasedSearchTerm]);


    return {
        activeTab,
        setActiveTab,
        users: filteredUsers, 
        posts: filteredPosts,
        comments: filteredComments,
        reviews: filteredReviews,
        reports: filteredReports,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        handleDeleteUser,
        handleDeletePost,
        handleDeleteComment,
        handleDeleteReview,
        handleUpdateReportStatus,
        handleRowClick,
        currentPage, 
        totalPages,
        handlePageChange, 
        ADMIN_ID,
        // RestaurantDetailModal 관련 상태 및 함수 반환
        isRestaurantDetailModalOpen,
        selectedRestaurantForModal,
        closeRestaurantDetailModal
    };
};

export default useAdmin;