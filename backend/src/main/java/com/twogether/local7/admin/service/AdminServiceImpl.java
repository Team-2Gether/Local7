package com.twogether.local7.admin.service;

import com.twogether.local7.admin.dao.AdminDAO;
import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.pagintion.Pageable;
import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO;
import com.twogether.local7.user.dao.UserDAO; // UserDAO 임포트 유지
import com.twogether.local7.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminDAO adminDAO;
    private final UserDAO userDAO; // UserDAO 유지

    @Override
    public boolean isAdmin(Long userId) {
        UserVO user = userDAO.findByUserId(userId); // UserDAO를 통해 사용자 정보 조회
        return user != null && user.getRuleId() != null && user.getRuleId() == 1L; // ruleId가 Long 타입이므로 1L로 비교
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
    @Transactional // 트랜잭션 처리
    public boolean updatePost(PostVO postVO) {
        // adminDAO에 postId만으로 업데이트하는 메서드가 필요합니다.
        // 현재 adminDAO에는 updatePost 메서드가 없으므로, adminMapper.xml과 AdminDAO.java에 추가해야 합니다.
        // 여기서는 adminDAO.updatePost(postVO)를 호출한다고 가정합니다.
        return adminDAO.updatePost(postVO) > 0;
    }

    @Override
    @Transactional // 트랜잭션 처리
    public void deletePost(Long postId) {
        // 게시글에 연결된 이미지 먼저 삭제
        adminDAO.deleteImagesByPostId(postId); // AdminDAO에 deleteImagesByPostId 메서드 추가 필요
        // 게시글 삭제
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

    @Override
    public Pagination<ReviewVO> getAllReviews(int pageNumber, int pageSize) {
        Pageable pageable = new SimplePageable(pageNumber, pageSize);
        List<ReviewVO> reviews = adminDAO.selectAllReviews(pageable);
        int totalElements = adminDAO.countAllReviews();
        return new Pagination<>(reviews, pageable, totalElements);
    }

    @Override
    public void deleteReview(Long reviewId) {
        adminDAO.deleteReview(reviewId);
    }

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
    @Transactional // 트랜잭션 처리
    public void deleteContentFromReport(Long reportId) {
        ReportVO report = adminDAO.getReportById(reportId);

        if (report != null) {
            String reportType = report.getReportType();
            Long targetId = report.getTargetId();

            if ("post".equals(reportType)) {
                // 게시글 삭제 시 이미지도 함께 삭제하도록 변경
                adminDAO.deleteImagesByPostId(targetId); // 이미지 삭제
                adminDAO.deletePost(targetId); // 게시글 삭제
            } else if ("comment".equals(reportType)) {
                adminDAO.deleteComment(targetId);
            } else if ("review".equals(reportType)) {
                adminDAO.deleteReview(targetId);
            }

            adminDAO.updateReportStatus(reportId, "PROCESSED");
        }
    }

    @Override
    @Transactional // 트랜잭션 처리
    public void deleteUser(Long userId) {
        adminDAO.deleteAllPostsByUserId(userId);
        adminDAO.deleteAllCommentsByUserId(userId);
        adminDAO.deleteAllReportsByUserId(userId);
        adminDAO.deleteAllReviewsByUserId(userId);
        adminDAO.deleteUser(userId);
    }

    @Override
    public RestaurantVO getRestaurantById(Long restaurantId) {
        return adminDAO.findRestaurantById(restaurantId);
    }
}
