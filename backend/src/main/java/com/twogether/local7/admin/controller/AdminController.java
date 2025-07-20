package com.twogether.local7.admin.controller;

import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.review.service.ReviewService;
import com.twogether.local7.review.vo.ReviewVO;
import com.twogether.local7.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ReviewService 주입
    @Autowired
    private ReviewService reviewService;

    // 공통 권한 확인 메서드
    private ResponseEntity<?> checkAdminAuth(Long userId) {
        if (userId == null || !adminService.isAdmin(userId)) {
            return new ResponseEntity<>("접근 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }
        return null; // 관리자 권한 확인 성공
    }

    // --- 사용자 관리 API ---

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("X-USER-ID") Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        List<UserVO> users = adminService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@RequestHeader("X-USER-ID") Long adminId,
                                        @PathVariable Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(adminId);
        if (authCheck != null) {
            return authCheck;
        }

        adminService.deleteUser(userId);
        return new ResponseEntity<>("사용자가 성공적으로 삭제되었습니다.", HttpStatus.OK);
    }

    // --- 게시글 관리 API ---

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts(@RequestHeader("X-USER-ID") Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        List<PostVO> posts = adminService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@RequestHeader("X-USER-ID") Long userId,
                                        @PathVariable Long postId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        adminService.deletePost(postId);
        return new ResponseEntity<>("게시글이 성공적으로 삭제되었습니다.", HttpStatus.OK);
    }

    // --- 댓글 관리 API ---

    @GetMapping("/comments")
    public ResponseEntity<?> getAllComments(@RequestHeader("X-USER-ID") Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        List<CommentVO> comments = adminService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@RequestHeader("X-USER-ID") Long userId,
                                           @PathVariable Long commentId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        adminService.deleteComment(commentId);
        return new ResponseEntity<>("댓글이 성공적으로 삭제되었습니다.", HttpStatus.OK);
    }

    // --- 신고 관리 API ---

    @GetMapping(value = "/reports", params = "sortBy")
    public ResponseEntity<?> getAllReports(@RequestHeader("X-USER-ID") Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        List<ReportVO> reports = adminService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @PatchMapping("/reports/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(@RequestHeader("X-USER-ID") Long userId,
                                                @PathVariable Long reportId,
                                                @RequestBody Map<String, String> request) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        String newStatus = request.get("status");
        adminService.updateReportStatus(reportId, newStatus);
        return new ResponseEntity<>("신고 상태가 성공적으로 업데이트되었습니다.", HttpStatus.OK);
    }

    // --- 리뷰 관리 API 추가 ---

    // 리뷰 목록 조회
    @GetMapping("/reviews")
    public Mono<ResponseEntity<?>> getAllReviews(@RequestHeader("X-USER-ID") Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return reviewService.getAllReviews()
                .map(reviews -> new ResponseEntity<>(reviews, HttpStatus.OK));
    }

    // 리뷰 삭제
    @DeleteMapping("/reviews/{reviewId}")
    public Mono<ResponseEntity<?>> deleteReview(@RequestHeader("X-USER-ID") Long userId,
                                                @PathVariable Long reviewId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return reviewService.deleteReview(reviewId)
                .thenReturn(new ResponseEntity<>("리뷰가 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }
}