import React from "react";
import useAdmin from "./hooks/useAdmin";
import UserList from "./components/AdminUserList";
import PostList from "./components/AdminPostList";
import CommentList from "./components/AdminCommentList";
import ReviewList from "./components/AdminReviewList";
import ReportList from "./components/AdminReportList";
import RestaurantDetailModal from "../restaurant/components/RestaurantDetailModal"
import "./AdminPage.css";

const AdminPage = ({ currentUser }) => {
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
        currentPage, 
        totalPages, 
        handlePageChange, 
        ADMIN_ID,
        isRestaurantDetailModalOpen,
        selectedRestaurantForModal,
        closeRestaurantDetailModal
    } = useAdmin(currentUser);

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
                    <UserList
                        users={users}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleDeleteUser={handleDeleteUser}
                        handleRowClick={handleRowClick}
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                    />
                );
            case "posts":
                return (
                    <PostList
                        posts={posts}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleDeletePost={handleDeletePost}
                        handleRowClick={handleRowClick}
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                    />
                );
            case "comments":
                return (
                    <CommentList
                        comments={comments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleDeleteComment={handleDeleteComment}
                        handleRowClick={handleRowClick}
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                    />
                );
            case "reviews":
                return (
                    <ReviewList
                        reviews={reviews}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleDeleteReview={handleDeleteReview}
                        handleRowClick={handleRowClick}
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                    />
                );
            case "reports":
                return (
                    <ReportList
                        reports={reports}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleUpdateReportStatus={handleUpdateReportStatus}
                        handleDeleteUser={handleDeleteUser}
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        handlePageChange={handlePageChange} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-page-container">
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

            {isRestaurantDetailModalOpen && selectedRestaurantForModal && (
                <RestaurantDetailModal
                    isOpen={isRestaurantDetailModalOpen}
                    onRequestClose={closeRestaurantDetailModal}
                    restaurant={selectedRestaurantForModal}
                    currentUser={currentUser} 
                    onReviewSubmitted={() => {}}
                />
            )}

        </div>
    );
};

export default AdminPage;