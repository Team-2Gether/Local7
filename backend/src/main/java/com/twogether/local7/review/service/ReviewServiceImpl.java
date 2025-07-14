package com.twogether.local7.review.service;

import com.twogether.local7.review.dao.ReviewDAO;
import com.twogether.local7.review.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers; // Schedulers 임포트

import java.util.List;

// 로깅을 위한 임포트 추가
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReviewServiceImpl implements ReviewService {

    // 로거 인스턴스 생성
    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    @Autowired
    private ReviewDAO reviewDAO;

    @Override
    public Mono<ReviewVO> addReview(ReviewVO review) {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: addReview 호출 - {}", review);
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
