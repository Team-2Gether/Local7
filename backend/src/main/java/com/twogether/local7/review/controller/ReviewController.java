package com.twogether.local7.review.controller;

import com.twogether.local7.review.service.ReviewService;
import com.twogether.local7.review.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    // 로거 인스턴스 생성
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    // 리뷰 작성 (POST 요청)
    @PostMapping
    public Mono<ResponseEntity<Map<String, Object>>> addReview(@RequestBody ReviewVO review) {
        logger.info("ReviewController: addReview 요청 수신 - {}", review);

        if (review.getUserId() != null) {
            review.setCreatedId(review.getUserId().toString());
        } else {
            review.setCreatedId("anonymous"); // userId가 없는 경우 임시 설정
            logger.warn("ReviewController: userId가 제공되지 않아 createdId를 'anonymous'로 설정합니다.");
        }

        return reviewService.addReview(review)
                .map(savedReview -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "리뷰가 성공적으로 작성되었습니다.");
                    response.put("data", savedReview);
                    logger.info("ReviewController: 리뷰 작성 성공 - reviewId: {}", savedReview.getReviewId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
                })
                .onErrorResume(e -> {
                    logger.error("ReviewController: 리뷰 작성 중 오류 발생: {}", e.getMessage(), e);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 작성 중 오류 발생: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Map<String, Object>>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }

    // 특정 맛집의 리뷰 목록 조회 (GET 요청)
    @GetMapping("/restaurant/{restaurantId}")
    public Mono<ResponseEntity<Map<String, Object>>> getReviewsByRestaurantId(@PathVariable Long restaurantId) {
        logger.info("ReviewController: getReviewsByRestaurantId 요청 수신 - restaurantId: {}", restaurantId);
        return reviewService.getReviewsByRestaurantId(restaurantId)
                .map(reviews -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", restaurantId + "번 맛집의 리뷰 목록 조회 성공");
                    response.put("data", reviews);
                    logger.info("ReviewController: restaurantId {}에 대한 리뷰 목록 조회 성공 ({}개)", restaurantId, reviews.size());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    logger.error("ReviewController: 리뷰 목록 조회 중 오류 발생: {}", e.getMessage(), e);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 목록 조회 중 오류 발생: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Map<String, Object>>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }

    // 리뷰 수정 (PUT 요청)
    @PutMapping("/{reviewId}")
    public Mono<ResponseEntity<Map<String, Object>>> updateReview(@PathVariable Long reviewId, @RequestBody ReviewVO review) {
        logger.info("ReviewController: updateReview 요청 수신 - reviewId: {}, review: {}", reviewId, review);
        review.setReviewId(reviewId); // PathVariable의 reviewId를 VO에 설정

        if (review.getUserId() != null) {
            review.setUpdatedId(review.getUserId().toString());
        } else {
            review.setUpdatedId("anonymous"); // userId가 없는 경우 임시 설정
            logger.warn("ReviewController: userId가 제공되지 않아 updatedId를 'anonymous'로 설정합니다.");
        }

        return reviewService.updateReview(review)
                .map(updatedReview -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", reviewId + "번 리뷰가 성공적으로 수정되었습니다.");
                    response.put("data", updatedReview);
                    logger.info("ReviewController: 리뷰 수정 성공 - reviewId: {}", updatedReview.getReviewId());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    logger.error("ReviewController: 리뷰 수정 중 오류 발생: {}", e.getMessage(), e);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 수정 중 오류 발생: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Map<String, Object>>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }

    // 리뷰 삭제 (DELETE 요청)
    @DeleteMapping("/{reviewId}")
    public Mono<ResponseEntity<Map<String, Object>>> deleteReview(@PathVariable Long reviewId) {
        logger.info("ReviewController: deleteReview 요청 수신 - reviewId: {}", reviewId);

        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("status", "success");
        successResponse.put("message", reviewId + "번 리뷰가 성공적으로 삭제되었습니다.");

        return reviewService.deleteReview(reviewId)
                .thenReturn(ResponseEntity.ok(successResponse))
                .onErrorResume(e -> {
                    logger.error("ReviewController: 리뷰 삭제 중 오류 발생: {}", e.getMessage(), e);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "리뷰 삭제 중 오류 발생: " + e.getMessage());
                    return Mono.just(new ResponseEntity<Map<String, Object>>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR));
                });
    }
}
