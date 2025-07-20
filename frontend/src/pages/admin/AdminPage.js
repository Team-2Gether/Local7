import React, {useState, useEffect} from "react";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = ({currentUser}) => {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ADMIN_ID = currentUser
        ?.userId; // 관리자 자신의 userId

    const fetchAdminData = async () => {
        if (!ADMIN_ID) {
            setError("사용자 정보를 불러올 수 없습니다.");
            return;
        }

        setLoading(true);
        setError(null);

        const headers = {
            'X-USER-ID': ADMIN_ID
        };

        try {
            let response;
            const BASE_URL = "http://localhost:8080"; // 백엔드 서버 URL 추가

            switch (activeTab) {
                case "users":
                    response = await axios.get(`${BASE_URL}/api/admin/users`, {headers});
                    setUsers(response.data);
                    break;
                case "posts":
                    response = await axios.get(`${BASE_URL}/api/admin/posts`, {headers});
                    setPosts(response.data);
                    break;
                case "comments":
                    response = await axios.get(`${BASE_URL}/api/admin/comments`, {headers});
                    setComments(response.data);
                    break;
                case "reports":
                    response = await axios.get(`${BASE_URL}/api/admin/reports`, {headers});
                    setReports(response.data);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error("Failed to fetch admin data:", err);
            setError("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    const handleDeletePost = async (postId) => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }
        try {
            const BASE_URL = "http://localhost:8080"; // 백엔드 서버 URL 추가
            await axios.delete(`${BASE_URL}/api/admin/posts/${postId}`, {
                headers: {
                    'X-USER-ID': ADMIN_ID
                }
            });
            alert("게시글이 삭제되었습니다.");
            setPosts(posts.filter(post => post.postId !== postId));
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("게시글 삭제에 실패했습니다.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            return;
        }
        try {
            const BASE_URL = "http://localhost:8080"; // 백엔드 서버 URL 추가
            await axios.delete(`${BASE_URL}/api/admin/comments/${commentId}`, {
                headers: {
                    'X-USER-ID': ADMIN_ID
                }
            });
            alert("댓글이 삭제되었습니다.");
            setComments(comments.filter(comment => comment.commentId !== commentId));
        } catch (err) {
            console.error("Failed to delete comment:", err);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    const handleUpdateReportStatus = async (reportId, newStatus) => {
        try {
            const BASE_URL = "http://localhost:8080"; // 백엔드 서버 URL 추가
            await axios.patch(`${BASE_URL}/api/admin/reports/${reportId}/status`, {
                status: newStatus
            }, {
                headers: {
                    'X-USER-ID': ADMIN_ID
                }
            });
            alert("신고 상태가 업데이트되었습니다.");
            fetchAdminData(); // 상태 업데이트 후 데이터 새로고침
        } catch (err) {
            console.error("Failed to update report status:", err);
            alert("신고 상태 업데이트에 실패했습니다.");
        }
    };

    const renderContent = () => {
        if (loading) {
            return <p>로딩 중...</p>;
        }
        if (error) {
            return <p className="admin-error-message">{error}</p>;
        }

        switch (activeTab) {
            case "users":
                return (
                    <div>
                        <h3>사용자 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>로그인 ID</th>
                                    <th>닉네임</th>
                                    <th>이메일</th>
                                    <th>가입일</th>
                                    <th>권한</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user.userId}>
                                            <td>{user.userId}</td>
                                            <td>{user.userLoginId}</td>
                                            <td>{user.userNickname}</td>
                                            <td>{user.userEmail}</td>
                                            <td>{new Date(user.createDate).toLocaleDateString()}</td>
                                            <td>{
                                                    user.ruleId === 1
                                                        ? "관리자"
                                                        : "일반"
                                                }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                );
            case "posts":
                return (
                    <div>
                        <h3>게시글 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    posts.map(post => (
                                        <tr key={post.postId}>
                                            <td>{post.postId}</td>
                                            <td>{post.postTitle}</td>
                                            <td>{post.userNickname}</td>
                                            <td>{new Date(post.createdDate).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeletePost(post.postId)}
                                                    className="admin-action-button delete">삭제</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                );
            case "comments":
                return (
                    <div>
                        <h3>댓글 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>내용</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    comments.map(comment => (
                                        <tr key={comment.commentId}>
                                            <td>{comment.commentId}</td>
                                            <td>{comment.content}</td>
                                            <td>{comment.userNickname}</td>
                                            <td>{new Date(comment.createdDate).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.commentId)}
                                                    className="admin-action-button delete">삭제</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                );
            case "reports":
                return (
                    <div>
                        <h3>신고 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>신고 대상</th>
                                    <th>사유</th>
                                    <th>상태</th>
                                    <th>신고일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reports.map(report => (
                                        <tr key={report.reportId}>
                                            <td>{report.reportId}</td>
                                            <td>{report.postTitle || report.commentContent}</td>
                                            <td>{report.reportReason}</td>
                                            <td>{report.reportStatus}</td>
                                            <td>{new Date(report.createdDate).toLocaleDateString()}</td>
                                            <td>
                                                {
                                                    report.reportStatus === '처리중'
                                                        ? (
                                                            <button
                                                                onClick={() => handleUpdateReportStatus(report.reportId, '처리완료')}
                                                                className="admin-action-button complete">처리 완료</button>
                                                        )
                                                        : (<span>처리 완료됨</span>)
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-page-container">
            <h2 className="admin-page-title">관리자 페이지</h2>
            <div className="admin-tabs">
                <button
                    onClick={() => setActiveTab("users")}
                    className={activeTab === "users"
                        ? "active"
                        : ""}>
                    사용자 관리
                </button>
                <button
                    onClick={() => setActiveTab("posts")}
                    className={activeTab === "posts"
                        ? "active"
                        : ""}>
                    게시글 관리
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={activeTab === "comments"
                        ? "active"
                        : ""}>
                    댓글 관리
                </button>
                <button
                    onClick={() => setActiveTab("reports")}
                    className={activeTab === "reports"
                        ? "active"
                        : ""}>
                    신고 관리
                </button>
            </div>
            <div className="admin-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;