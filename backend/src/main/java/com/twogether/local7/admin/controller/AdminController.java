package com.twogether.local7.admin.controller;

import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.restaurant.vo.RestaurantVO;
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
    public Mono<ResponseEntity<?>> getAllUsers(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            Pagination<UserVO> usersPagination = adminService.getAllUsers(page, size);
            System.out.println("Returning users pagination: " + usersPagination);
            return usersPagination;
        }).map(users -> new ResponseEntity<>(users, HttpStatus.OK));
    }

    @DeleteMapping("/users/{userId}")
    public Mono<ResponseEntity<?>> deleteUser(@RequestHeader("X-USER-ID") Long adminId,
                                              @PathVariable Long userId) {
        ResponseEntity<?> authCheck = checkAdminAuth(adminId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deleteUser(userId))
                .thenReturn(new ResponseEntity<>("사용자가 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 게시글 관리 API ---
    @GetMapping("/posts")
    public Mono<ResponseEntity<?>> getAllPosts(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            Pagination<PostVO> postsPagination = adminService.getAllPosts(page, size);
            System.out.println("Returning posts pagination: " + postsPagination);
            return postsPagination;
        }).map(posts -> new ResponseEntity<>(posts, HttpStatus.OK));
    }

    @DeleteMapping("/posts/{postId}")
    public Mono<ResponseEntity<?>> deletePost(@RequestHeader("X-USER-ID") Long userId,
                                              @PathVariable Long postId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deletePost(postId))
                .thenReturn(new ResponseEntity<>("게시글이 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 댓글 관리 API ---
    @GetMapping("/comments")
    public Mono<ResponseEntity<?>> getAllComments(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            Pagination<CommentVO> commentsPagination = adminService.getAllComments(page, size);
            System.out.println("Returning comments pagination: " + commentsPagination);
            return commentsPagination;
        }).map(comments -> new ResponseEntity<>(comments, HttpStatus.OK));
    }

    @DeleteMapping("/comments/{commentId}")
    public Mono<ResponseEntity<?>> deleteComment(@RequestHeader("X-USER-ID") Long userId,
                                                 @PathVariable Long commentId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deleteComment(commentId))
                .thenReturn(new ResponseEntity<>("댓글이 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 리뷰 관리 API 추가 ---
    @GetMapping("/reviews")
    public Mono<ResponseEntity<?>> getAllReviews(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);

        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        // reviewService를 사용하거나 adminService에 getAllReviews를 추가하여 사용
        return Mono.fromCallable(() -> {
            Pagination<ReviewVO> reviewsPagination = adminService.getAllReviews(page, size);
            System.out.println("Returning reviews pagination: " + reviewsPagination);
            return reviewsPagination;
        }).map(reviews -> new ResponseEntity<>(reviews, HttpStatus.OK));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public Mono<ResponseEntity<?>> deleteReview(@RequestHeader("X-USER-ID") Long userId,
                                                @PathVariable Long reviewId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deleteReview(reviewId))
                .thenReturn(new ResponseEntity<>("리뷰가 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 신고 관리 API ---
    @GetMapping("/reports")
    public Mono<ResponseEntity<?>> getAllReports(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            Pagination<ReportVO> reportsPagination = adminService.getAllReports(page, size);
            System.out.println("Returning reports pagination: " + reportsPagination);
            return reportsPagination;
        }).map(reports -> new ResponseEntity<>(reports, HttpStatus.OK));
    }

    @PatchMapping("/reports/{reportId}/status")
    public Mono<ResponseEntity<?>> updateReportStatus(@RequestHeader("X-USER-ID") Long userId,
                                                      @PathVariable Long reportId,
                                                      @RequestBody Map<String, String> body) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }
        String status = body.get("status");
        if (status == null || (!status.equals("PENDING") && !status.equals("COMPLETED") && !status.equals("PROCESSED"))) {
            return Mono.just(new ResponseEntity<>("유효하지 않은 상태 값입니다.", HttpStatus.BAD_REQUEST));
        }
        return Mono.fromRunnable(() -> adminService.updateReportStatus(reportId, status))
                .thenReturn(new ResponseEntity<>("신고 상태가 성공적으로 업데이트되었습니다.", HttpStatus.OK));
    }

    @DeleteMapping("/reports/{reportId}/content")
    public ResponseEntity<?> deleteContentFromReport(@RequestHeader("X-USER-ID") Long userId,
                                                     @PathVariable Long reportId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        adminService.deleteContentFromReport(reportId);
        return new ResponseEntity<>("신고된 콘텐츠가 성공적으로 삭제되었습니다.", HttpStatus.OK);
    }

    // --- 음식점 상세 정보 조회 API (리뷰 클릭 시 사용) ---
    @GetMapping("/restaurants/{restaurantId}")
    public Mono<ResponseEntity<?>> getRestaurantById(
            @RequestHeader("X-USER-ID") Long userId, // 관리자 ID 헤더
            @PathVariable Long restaurantId) {
        ResponseEntity<?> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            // AdminService에서 음식점 상세 정보를 조회하도록 호출
            RestaurantVO restaurant = adminService.getRestaurantById(restaurantId);
            return restaurant;
        }).map(restaurant -> {
            if (restaurant != null) {
                return new ResponseEntity<>(restaurant, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("음식점을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }
        }).onErrorResume(e -> {
            // 오류 처리 로직 추가 (예: DB 연결 문제 등)
            System.err.println("음식점 정보 조회 중 오류 발생: " + e.getMessage());
            return Mono.just(new ResponseEntity<>("음식점 정보 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR));
        });
    }
}