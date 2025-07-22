import React from "react";
import useAdmin from "./hooks/useAdmin"; 
import "./AdminPage.css";

const AdminPage = ({ currentUser }) => {
    // useAdmin 훅을 사용하여 필요한 상태와 함수들을 가져옴
    const {
        activeTab,
        setActiveTab,
        users,
        posts,
        comments,
        reviews,
        reports,
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
    } = useAdmin(currentUser); // currentUser를 훅에 전달

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
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="사용자 ID, 로그인 ID, 닉네임, 이메일 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search-input"
                            />
                        </div>
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
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user.userId}>
                                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userId}</td>
                                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userLoginId}</td>
                                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userNickname}</td>
                                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{new Date(user.createDate).toLocaleDateString()}</td>
                                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{
                                                user.ruleId === 1
                                                    ? "관리자"
                                                    : "일반"
                                            }
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteUser(user.userId)}
                                                    className="admin-action-button delete">삭제</button>
                                            </td>
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
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="게시글 제목, 작성자 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search-input"
                            />
                        </div>
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
                                            <td onClick={() => handleRowClick(post.postId, "post")}>{post.postId}</td>
                                            <td onClick={() => handleRowClick(post.postId, "post")}>{post.postTitle}</td>
                                            <td onClick={() => handleRowClick(post.postId, "post")}>{post.userNickname}</td>
                                            <td onClick={() => handleRowClick(post.postId, "post")}>{new Date(post.createdDate).toLocaleDateString()}</td>
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
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="댓글 내용, 작성자 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search-input"
                            />
                        </div>
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
                                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.commentId}</td>
                                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.content}</td>
                                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.userNickname}</td>
                                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{new Date(comment.createdDate).toLocaleDateString()}</td>
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
            case "reviews":
                return (
                    <div>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="리뷰 내용, 작성자 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search-input"
                            />
                        </div>
                        <h3>리뷰 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>내용</th>
                                    <th>작성자</th>
                                    <th>별점</th>
                                    <th>작성일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reviews.map(review => (
                                        <tr key={review.reviewId}>
                                            <td>{review.reviewId}</td>
                                            <td>{review.reviewContent}</td>
                                            <td>{review.userNickname}</td>
                                            <td>{review.reviewRating}</td>
                                            <td>{new Date(review.createdDate).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeleteReview(review.reviewId)}
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
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="신고 대상, 사유 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-search-input"
                            />
                        </div>
                        <h3>신고 목록</h3>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>신고 유형</th>
                                    <th>신고한 사람</th>
                                    <th>신고 대상</th>
                                    <th>신고 대상 내용</th>
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
                                            <td>
                                                {report.reportType === 'post' ? '스레드' :
                                                    report.reportType === 'review' ? '리뷰' :
                                                        '댓글'}
                                            </td>
                                            <td>{report.reporterNickname}</td>
                                            <td>{report.targetNickname}</td>
                                            <td>
                                                {/* 신고 유형에 따라 게시글 제목 또는 댓글 내용을 표시 */}
                                                {report.reportType === 'post' && report.postTitle}
                                                {report.reportType === 'review' && report.reviewContent}
                                                {report.reportType === 'comment' && report.commentContent}
                                            </td>
                                            <td>{report.reportReason}</td>
                                            <td>{report.status === 'PENDING' ? '대기 중' : '처리 완료'}</td>
                                            <td>{new Date(report.createdDate).toLocaleDateString()}</td>
                                            <td>
                                                {
                                                    report.status === 'PENDING'
                                                        ? (
                                                            <div className="admin-action-buttons-container">
                                                                <button
                                                                    onClick={() => handleUpdateReportStatus(report.reportId, 'COMPLETED')}
                                                                    className="admin-action-button complete">
                                                                    처리
                                                                </button>

                                                                {/* 신고 대상 사용자의 ID가 있을 경우에만 '삭제' 버튼 표시 */}
                                                                {report.targetUserId && (
                                                                    <button
                                                                        onClick={() => handleDeleteUser(report.targetUserId, report.targetNickname)}
                                                                        className="admin-action-button delete">
                                                                        삭제
                                                                    </button>
                                                                )}
                                                            </div>
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
                    className={activeTab === "users" ? "active" : ""}>
                    사용자 관리
                </button>
                <button
                    onClick={() => setActiveTab("posts")}
                    className={activeTab === "posts" ? "active" : ""}>
                    스레드 관리
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={activeTab === "comments" ? "active" : ""}>
                    댓글 관리
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={activeTab === "reviews" ? "active" : ""}>
                    리뷰 관리
                </button>
                <button
                    onClick={() => setActiveTab("reports")}
                    className={activeTab === "reports" ? "active" : ""}>
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