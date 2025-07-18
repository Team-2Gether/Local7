package com.twogether.local7.review.service;

import com.twogether.local7.ai.service.AiService;
import com.twogether.local7.ai.vo.AiReviewRequest;
import com.twogether.local7.ai.vo.AiReviewResponse;
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

    @Autowired
    private AiService aiService;

    @Override
    public Mono<ReviewVO> addReview(ReviewVO review) {
        return Mono.fromCallable(() -> {

            // 1. AI 리뷰 요약 및 키워드 추출 요청
            AiReviewRequest aiRequest = new AiReviewRequest();
            aiRequest.setReview_text(review.getReviewContent());

            // 2. AI 서비스 호출 (비동기)
            AiReviewResponse aiResponse = aiService.summarizeReview(aiRequest).block();

            // 3. AI 응답을 ReviewVO에 설정
            if (aiResponse != null) {
                review.setAiSummary(aiResponse.getSummary());
                // 키워드 리스트를 하나의 문자열로 변환하여 저장
                review.setAiKeywords(String.join(", ", aiResponse.getKeywords()));
            }

            // 4. AI 분석 결과를 포함한 리뷰를 DB에 저장
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
