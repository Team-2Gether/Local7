package com.twogether.local7.review.service;

import com.twogether.local7.ai.service.AiService;
import com.twogether.local7.ai.vo.AiReviewRequest;
import com.twogether.local7.ai.vo.AiReviewResponse;
import com.twogether.local7.review.dao.ReviewDAO;
import com.twogether.local7.review.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    @Autowired
    private ReviewDAO reviewDAO;

    @Autowired(required = false) // AiService가 없을 수도 있으므로 required = false
    private AiService aiService;

    @Override
    public Mono<ReviewVO> addReview(ReviewVO review) {
        return Mono.fromCallable(() -> {
            // AI Service가 주입된 경우에만 요약 및 키워드 추출 로직 실행
            if (aiService != null) {
                AiReviewRequest aiRequest = new AiReviewRequest();
                aiRequest.setReview_text(review.getReviewContent());

                // block()은 Mono를 동기적으로 처리 (실제 환경에서는 비동기 처리 권장)
                AiReviewResponse aiResponse = aiService.summarizeReview(aiRequest).block();

                if (aiResponse != null) {
                    review.setAiSummary(aiResponse.getSummary());
                    review.setAiKeywords(String.join(", ", aiResponse.getKeywords()));
                }
            }

            reviewDAO.insertReview(review);
            logger.info("ReviewService: 리뷰 추가 성공, ID: {}", review.getReviewId());
            return review;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<List<ReviewVO>> getReviewsByRestaurantId(Long restaurantId) {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: getReviewsByRestaurantId 호출 - restaurantId: {}", restaurantId);
            List<ReviewVO> reviews = reviewDAO.findReviewsByRestaurantId(restaurantId);
            logger.info("ReviewService: restaurantId {}에 대한 리뷰 {}개 조회 성공", restaurantId, reviews.size());
            return reviews;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    // 새롭게 추가: 특정 맛집의 리뷰를 제한된 개수만큼 조회하는 메서드 구현
    @Override
    public Mono<List<ReviewVO>> getReviewsByRestaurantId(Long restaurantId, int limit) {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: getReviewsByRestaurantId 호출 - restaurantId: {}, limit: {}", restaurantId, limit);
            // DAO에 findReviewsByRestaurantIdWithLimit 메서드 호출
            List<ReviewVO> reviews = reviewDAO.findReviewsByRestaurantIdWithLimit(restaurantId, limit);
            logger.info("ReviewService: restaurantId {}에 대한 리뷰 {}개 (제한 {}) 조회 성공", restaurantId, reviews.size(), limit);
            return reviews;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<List<ReviewVO>> getAllReviews() {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: getAllReviews 호출");
            List<ReviewVO> reviews = reviewDAO.findAllReviews();
            logger.info("ReviewService: 전체 리뷰 {}개 조회 성공", reviews.size());
            return reviews;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<ReviewVO> updateReview(ReviewVO review) {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: updateReview 호출 - {}", review);
            // 오류 수정: 닫는 따옴표 앞의 백슬래시 제거
            logger.info("ReviewService: 리뷰 업데이트 성공, ID: {}", review.getReviewId());
            return review;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<Void> deleteReview(Long reviewId) {
        return Mono.fromRunnable(() -> {
            logger.info("ReviewService: deleteReview 호출 - reviewId: {}", reviewId);
            reviewDAO.deleteReview(reviewId);
            logger.info("ReviewService: 리뷰 삭제 성공, ID: {}", reviewId);
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }
}
