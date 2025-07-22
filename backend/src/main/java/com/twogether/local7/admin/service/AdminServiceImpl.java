package com.twogether.local7.admin.service.impl;

import com.twogether.local7.admin.dao.AdminDAO;
import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.pagintion.Pageable;
import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO; // ReviewVO import
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminDAO adminDAO;
    private final UserDAO userDAO;

    @Override
    public boolean isAdmin(Long userId) {
        UserVO user = userDAO.findByUserId(userId);
        return user != null && user.getRuleId() != null && user.getRuleId() == 1;
    }

    @Override
    public Pagination<UserVO> getAllUsers(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<UserVO> users = adminDAO.selectAllUsers(pageable);
        int totalElements = adminDAO.countAllUsers();
        return new Pagination<>(users, pageable, totalElements);
    }

    @Override
    public Pagination<PostVO> getAllPosts(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<PostVO> posts = adminDAO.selectAllPosts(pageable);
        int totalElements = adminDAO.countAllPosts();
        return new Pagination<>(posts, pageable, totalElements);
    }

    @Override
    public void deletePost(Long postId) {
        adminDAO.deletePost(postId);
    }

    @Override
    public Pagination<CommentVO> getAllComments(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<CommentVO> comments = adminDAO.selectAllComments(pageable);
        int totalElements = adminDAO.countAllComments();
        return new Pagination<>(comments, pageable, totalElements);
    }

    @Override
    public void deleteComment(Long commentId) {
        adminDAO.deleteComment(commentId);
    }

    // 리뷰 목록 조회 추가
    @Override
    public Pagination<ReviewVO> getAllReviews(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<ReviewVO> reviews = adminDAO.selectAllReviews(pageable);
        int totalElements = adminDAO.countAllReviews();
        return new Pagination<>(reviews, pageable, totalElements);
    }

    @Override
    public void deleteReview(Long reviewId) { adminDAO.deleteReview(reviewId); }

    @Override
    public Pagination<ReportVO> getAllReports(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<ReportVO> reports = adminDAO.selectAllReports(pageable);
        int totalElements = adminDAO.countAllReports();
        return new Pagination<>(reports, pageable, totalElements);
    }

    @Override
    public void updateReportStatus(Long reportId, String status) {
        adminDAO.updateReportStatus(reportId, status);
    }

    @Override
    public void deleteContentFromReport(Long reportId) {
        ReportVO report = adminDAO.getReportById(reportId);

        if (report != null) {
            String reportType = report.getReportType();
            Long targetId = report.getTargetId();

            if ("post".equals(reportType)) {
                adminDAO.deletePost(targetId);
            } else if ("comment".equals(reportType)) {
                adminDAO.deleteComment(targetId);
            } else if ("review".equals(reportType)) {
                adminDAO.deleteReview(targetId);
            }

            adminDAO.updateReportStatus(reportId, "PROCESSED");
        }
    }

    // 사용자 삭제 메소드 구현
    @Override
    public void deleteUser(Long userId) {
        adminDAO.deleteAllPostsByUserId(userId);
        adminDAO.deleteAllCommentsByUserId(userId);
        adminDAO.deleteAllReportsByUserId(userId);
        adminDAO.deleteAllReviewsByUserId(userId); // 리뷰 기록 삭제 추가
        adminDAO.deleteUser(userId); // 최종 사용자 삭제
    }

    // 음식점 ID로 음식점 상세 정보 조회 메서드
    @Override
    public RestaurantVO getRestaurantById(Long restaurantId) {
        return adminDAO.findRestaurantById(restaurantId);
    }

}