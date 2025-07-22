import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../../../api/AdminApi'; // AdminApi 불러오기

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

    const navigate = useNavigate();

    // currentUser에서 ADMIN_ID를 가져옵니다.
    const ADMIN_ID = currentUser?.userId;

    // 데이터를 가져오는 함수
    const fetchAdminData = useCallback(async () => {
        if (!ADMIN_ID) {
            setError("관리자 정보를 불러올 수 없습니다. 로그인 상태를 확인해주세요.");
            setLoading(false); // 로딩 상태를 false로 설정하여 UI가 멈추지 않도록 합니다.
            return;
        }

        setLoading(true);
        setError(null);

        try {
            switch (activeTab) {
                case "users":
                    const userData = await AdminApi.getUsers(ADMIN_ID); // ADMIN_ID 전달
                    setUsers(userData);
                    break;
                case "posts":
                    const postData = await AdminApi.getPosts(ADMIN_ID); // ADMIN_ID 전달
                    setPosts(postData);
                    break;
                case "comments":
                    const commentData = await AdminApi.getComments(ADMIN_ID); // ADMIN_ID 전달
                    setComments(commentData);
                    break;
                case "reviews":
                    const reviewData = await AdminApi.getReviews(ADMIN_ID); // ADMIN_ID 전달
                    setReviews(reviewData);
                    break;
                case "reports":
                    const reportData = await AdminApi.getReports(ADMIN_ID); // ADMIN_ID 전달
                    setReports(reportData);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error(`Failed to fetch ${activeTab} data:`, err);
            // 서버에서 받은 에러 메시지가 있다면 사용자에게 표시
            setError(err.message || "데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [activeTab, ADMIN_ID]); // ADMIN_ID와 activeTab이 변경될 때만 재생성

    useEffect(() => {
        fetchAdminData();
        setSearchTerm(""); // 탭 변경 시 검색어 초기화
    }, [activeTab, fetchAdminData]);

    // 사용자 삭제 핸들러
    const handleDeleteUser = useCallback(async (userId) => {
        if (!ADMIN_ID) {
            alert("관리자 권한이 없습니다.");
            return;
        }
        if (ADMIN_ID === userId) {
            alert("자신을 삭제할 수 없습니다.");
            return;
        }
        if (!window.confirm("정말로 이 사용자를 삭제하시겠습니까? (삭제 시 사용자 관련 게시글, 댓글 다 삭제됩니다.) ")) {
            return;
        }
        try {
            await AdminApi.deleteUser(userId, ADMIN_ID); // ADMIN_ID 전달
            alert("사용자가 삭제되었습니다.");
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            // 사용자가 삭제되었으므로, 관련 게시글/댓글/리뷰도 새로고침 필요
            fetchAdminData(); // 전체 데이터 새로고침
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert(`사용자 삭제에 실패했습니다: ${err.message || err}`);
        }
    }, [ADMIN_ID, fetchAdminData]);

    // 게시글 삭제 핸들러
    const handleDeletePost = useCallback(async (postId) => {
        if (!ADMIN_ID) {
            alert("관리자 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }
        try {
            await AdminApi.deletePost(postId, ADMIN_ID); // ADMIN_ID 전달
            alert("게시글이 삭제되었습니다.");
            setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
            fetchAdminData(); // 댓글/리뷰 등 관련 데이터 새로고침
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert(`게시글 삭제에 실패했습니다: ${err.message || err}`);
        }
    }, [ADMIN_ID, fetchAdminData]);

    // 댓글 삭제 핸들러
    const handleDeleteComment = useCallback(async (commentId) => {
        if (!ADMIN_ID) {
            alert("관리자 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            return;
        }
        try {
            await AdminApi.deleteComment(commentId, ADMIN_ID); // ADMIN_ID 전달
            alert("댓글이 삭제되었습니다.");
            setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
            fetchAdminData(); // 게시글 등 관련 데이터 새로고침
        } catch (err) {
            console.error("Failed to delete comment:", err);
            alert(`댓글 삭제에 실패했습니다: ${err.message || err}`);
        }
    }, [ADMIN_ID, fetchAdminData]);

    // 리뷰 삭제 핸들러
    const handleDeleteReview = useCallback(async (reviewId) => {
        if (!ADMIN_ID) {
            alert("관리자 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            return;
        }
        try {
            await AdminApi.deleteReview(reviewId, ADMIN_ID); // ADMIN_ID 전달
            alert("리뷰가 삭제되었습니다.");
            setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
        } catch (err) {
            console.error("Failed to delete review:", err);
            alert(`리뷰 삭제에 실패했습니다: ${err.message || err}`);
        }
    }, [ADMIN_ID]);

    // 신고 상태 업데이트 핸들러
    const handleUpdateReportStatus = useCallback(async (reportId, newStatus) => {
        if (!ADMIN_ID) {
            alert("관리자 권한이 없습니다.");
            return;
        }
        try {
            await AdminApi.updateReportStatus(reportId, newStatus, ADMIN_ID); // ADMIN_ID 전달
            alert("신고 상태가 업데이트되었습니다.");
            fetchAdminData(); // 상태 업데이트 후 데이터 새로고침
        } catch (err) {
            console.error("Failed to update report status:", err);
            alert(`신고 상태 업데이트에 실패했습니다: ${err.message || err}`);
        }
    }, [ADMIN_ID, fetchAdminData]);

    // 상세 페이지로 이동하는 함수
    const handleRowClick = useCallback((id, type) => {
        switch (type) {
            case "user":
                navigate(`/user/profile/${id}`);
                break;
            case "post":
                navigate(`/posts/${id}`);
                break;
            case "comment":
                navigate(`/posts/${id}`); // 댓글의 경우 해당 게시글로 이동
                break;
            default:
                break;
        }
    }, [navigate]);

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    // useMemo를 사용하여 검색/정렬된 목록을 캐싱
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.userId.toString().includes(lowercasedSearchTerm) ||
            user.userLoginId.toLowerCase().includes(lowercasedSearchTerm) ||
            user.userNickname.toLowerCase().includes(lowercasedSearchTerm) ||
            user.userEmail.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [users, lowercasedSearchTerm]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.postTitle.toLowerCase().includes(lowercasedSearchTerm) ||
            post.userNickname.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [posts, lowercasedSearchTerm]);

    const filteredComments = useMemo(() => {
        return comments.filter(comment =>
            comment.content.toLowerCase().includes(lowercasedSearchTerm) ||
            comment.userNickname.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [comments, lowercasedSearchTerm]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(review =>
            review.reviewContent.toLowerCase().includes(lowercasedSearchTerm) ||
            review.userNickname.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [reviews, lowercasedSearchTerm]);

    const filteredReports = useMemo(() => {
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
        ADMIN_ID 
    };
};

export default useAdmin;
