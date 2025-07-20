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

    @Autowired
    private AiService aiService;

    @Override
    public Mono<ReviewVO> addReview(ReviewVO review) {
        return Mono.fromCallable(() -> {

            AiReviewRequest aiRequest = new AiReviewRequest();
            aiRequest.setReview_text(review.getReviewContent());

            AiReviewResponse aiResponse = aiService.summarizeReview(aiRequest).block();

            if (aiResponse != null) {
                review.setAiSummary(aiResponse.getSummary());
                review.setAiKeywords(String.join(", ", aiResponse.getKeywords()));
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

    @Override
    public Mono<List<ReviewVO>> getAllReviews() { // 리뷰 전체 목록 조회 로직 추가
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
            reviewDAO.updateReview(review);
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