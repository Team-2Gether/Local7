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
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ReviewService reviewService;

    // 공통 권한 확인 메서드 (ResponseEntity<Object>로 변경)
    private ResponseEntity<Object> checkAdminAuth(Long userId) {
        if (userId == null || !adminService.isAdmin(userId)) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "접근 권한이 없습니다.");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }
        return null; // 관리자 권한 확인 성공
    }

    // --- 사용자 관리 API (ResponseEntity<Object>로 변경) ---
    @GetMapping("/users")
    public Mono<ResponseEntity<Object>> getAllUsers(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    Pagination<UserVO> usersPagination = adminService.getAllUsers(page, size);
                    System.out.println("Returning users pagination: " + usersPagination);
                    return usersPagination;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(users -> new ResponseEntity<Object>(users, HttpStatus.OK));
    }

    @DeleteMapping("/users/{userId}")
    public Mono<ResponseEntity<Object>> deleteUser(@RequestHeader("X-USER-ID") Long adminId,
                                                   @PathVariable Long userId) {
        ResponseEntity<Object> authCheck = checkAdminAuth(adminId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deleteUser(userId))
                .subscribeOn(Schedulers.boundedElastic())
                .thenReturn(new ResponseEntity<Object>("사용자가 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 게시글 관리 API (ResponseEntity<Object>로 변경) ---
    @GetMapping("/posts")
    public Mono<ResponseEntity<Object>> getAllPosts(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    Pagination<PostVO> postsPagination = adminService.getAllPosts(page, size);
                    System.out.println("Returning posts pagination: " + postsPagination);
                    return postsPagination;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(posts -> new ResponseEntity<Object>(posts, HttpStatus.OK));
    }

    // 관리자용 게시글 수정 추가 (ResponseEntity<Object>로 변경)
    @PutMapping("/posts/{postId}")
    public Mono<ResponseEntity<Object>> updatePost(@RequestHeader("X-USER-ID") Long userId,
                                                   @PathVariable Long postId,
                                                   @RequestBody PostVO postVO) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
            postVO.setPostId(postId);

            boolean success = adminService.updatePost(postVO);
            if (success) {
                return new ResponseEntity<Object>("게시글이 성공적으로 수정되었습니다.", HttpStatus.OK);
            } else {
                return new ResponseEntity<Object>("게시글 수정에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @DeleteMapping("/posts/{postId}")
    public Mono<ResponseEntity<Object>> deletePost(@RequestHeader("X-USER-ID") Long userId,
                                                   @PathVariable Long postId) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deletePost(postId))
                .subscribeOn(Schedulers.boundedElastic())
                .thenReturn(new ResponseEntity<Object>("게시글이 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 댓글 관리 API (ResponseEntity<Object>로 변경) ---
    @GetMapping("/comments")
    public Mono<ResponseEntity<Object>> getAllComments(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    Pagination<CommentVO> commentsPagination = adminService.getAllComments(page, size);
                    System.out.println("Returning comments pagination: " + commentsPagination);
                    return commentsPagination;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(comments -> new ResponseEntity<Object>(comments, HttpStatus.OK));
    }

    @DeleteMapping("/comments/{commentId}")
    public Mono<ResponseEntity<Object>> deleteComment(@RequestHeader("X-USER-ID") Long userId,
                                                      @PathVariable Long commentId) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromRunnable(() -> adminService.deleteComment(commentId))
                .subscribeOn(Schedulers.boundedElastic())
                .thenReturn(new ResponseEntity<Object>("댓글이 성공적으로 삭제되었습니다.", HttpStatus.OK));
    }

    // --- 리뷰 관리 API 추가 (ResponseEntity<Object>로 변경) ---
    @GetMapping("/reviews")
    public Mono<ResponseEntity<Object>> getAllReviews(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);

        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    Pagination<ReviewVO> reviewsPagination = adminService.getAllReviews(page, size);
                    System.out.println("Returning reviews pagination: " + reviewsPagination);
                    return reviewsPagination;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(reviews -> new ResponseEntity<Object>(reviews, HttpStatus.OK));
    }

    // 관리자용 리뷰 수정 추가 (ResponseEntity<Object>로 변경)
    @PutMapping("/reviews/{reviewId}")
    public Mono<ResponseEntity<Object>> adminUpdateReview(
            @RequestHeader("X-USER-ID") Long userId,
            @PathVariable Long reviewId,
            @RequestBody ReviewVO review
    ) {
        // 관리자 권한 확인
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        review.setReviewId(reviewId);

        // 기존 reviewService.updateReview 호출
        return reviewService.updateReview(review)
                .subscribeOn(Schedulers.boundedElastic())
                .map(updatedReview -> {
                    // 성공 응답 구성 (Map 사용)
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "리뷰가 성공적으로 수정되었습니다.");
                    response.put("data", updatedReview);
                    return new ResponseEntity<Object>(response, HttpStatus.OK);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    // 리뷰를 찾을 수 없거나 수정 실패 시 응답
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰를 찾을 수 없거나 수정에 실패했습니다.");
                    return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.NOT_FOUND));
                }))
                .onErrorResume(e -> {
                    // 예외 발생 시 응답
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 수정 중 오류가 발생했습니다: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }

    @DeleteMapping("/reviews/{reviewId}") // 기존 AdminController에 있던 메서드이므로 그대로 유지 (ResponseEntity<Object>로 변경)
    public Mono<ResponseEntity<Object>> deleteReview(@RequestHeader("X-USER-ID") Long userId,
                                                     @PathVariable Long reviewId) {
        // 관리자 권한 확인
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        // 기존 reviewService.deleteReview 호출
        return reviewService.deleteReview(reviewId)
                .subscribeOn(Schedulers.boundedElastic())
                .then(Mono.fromCallable(() -> {
                    // 성공 응답 구성 (Map 사용)
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "리뷰가 성공적으로 삭제되었습니다.");
                    return new ResponseEntity<Object>(response, HttpStatus.OK);
                }))
                .switchIfEmpty(Mono.defer(() -> {
                    // 삭제할 리뷰를 찾을 수 없거나 삭제 실패 시 응답
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "삭제할 리뷰를 찾을 수 없습니다.");
                    return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.NOT_FOUND));
                }))
                .onErrorResume(e -> {
                    // 예외 발생 시 응답
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 삭제 중 오류가 발생했습니다: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }

    // --- 신고 관리 API (ResponseEntity<Object>로 변경) ---
    @GetMapping("/reports")
    public Mono<ResponseEntity<Object>> getAllReports(
            @RequestHeader("X-USER-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    Pagination<ReportVO> reportsPagination = adminService.getAllReports(page, size);
                    System.out.println("Returning reports pagination: " + reportsPagination);
                    return reportsPagination;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(reports -> new ResponseEntity<Object>(reports, HttpStatus.OK));
    }

    @PatchMapping("/reports/{reportId}/status")
    public Mono<ResponseEntity<Object>> updateReportStatus(@RequestHeader("X-USER-ID") Long userId,
                                                           @PathVariable Long reportId,
                                                           @RequestBody Map<String, String> body) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }
        String status = body.get("status");
        if (status == null || (!status.equals("PENDING") && !status.equals("COMPLETED") && !status.equals("PROCESSED"))) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "유효하지 않은 상태 값입니다.");
            return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.BAD_REQUEST));
        }
        return Mono.fromRunnable(() -> adminService.updateReportStatus(reportId, status))
                .subscribeOn(Schedulers.boundedElastic())
                .thenReturn(new ResponseEntity<Object>("신고 상태가 성공적으로 업데이트되었습니다.", HttpStatus.OK));
    }

    @DeleteMapping("/reports/{reportId}/content")
    public ResponseEntity<Object> deleteContentFromReport(@RequestHeader("X-USER-ID") Long userId,
                                                          @PathVariable Long reportId) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return authCheck;
        }

        adminService.deleteContentFromReport(reportId);
        return new ResponseEntity<Object>("신고된 콘텐츠가 성공적으로 삭제되었습니다.", HttpStatus.OK);
    }

    // --- 음식점 상세 정보 조회 API (리뷰 클릭 시 사용) ---
    @GetMapping("/restaurants/{restaurantId}")
    public Mono<ResponseEntity<Object>> getRestaurantById(
            @RequestHeader("X-USER-ID") Long userId, // 관리자 ID 헤더
            @PathVariable Long restaurantId) {
        ResponseEntity<Object> authCheck = checkAdminAuth(userId);
        if (authCheck != null) {
            return Mono.just(authCheck);
        }

        return Mono.fromCallable(() -> {
                    // AdminService에서 음식점 상세 정보를 조회하도록 호출
                    RestaurantVO restaurant = adminService.getRestaurantById(restaurantId);
                    return restaurant;
                }).subscribeOn(Schedulers.boundedElastic())
                .map(restaurant -> {
                    if (restaurant != null) {
                        return new ResponseEntity<Object>(restaurant, HttpStatus.OK);
                    } else {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("status", "error");
                        errorResponse.put("message", "음식점을 찾을 수 없습니다.");
                        return new ResponseEntity<Object>(errorResponse, HttpStatus.NOT_FOUND);
                    }
                }).onErrorResume(e -> {
                    // 오류 처리 로직 추가 (예: DB 연결 문제 등)
                    System.err.println("음식점 정보 조회 중 오류 발생: " + e.getMessage());
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "음식점 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Object>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }
}
