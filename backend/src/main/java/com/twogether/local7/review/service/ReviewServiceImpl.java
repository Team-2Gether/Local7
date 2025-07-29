package com.twogether.local7.review.service;

import com.twogether.local7.ai.service.AiService;
import com.twogether.local7.ai.vo.AiReviewRequest;
import com.twogether.local7.ai.vo.AiReviewResponse;
import com.twogether.local7.restaurant.dao.RestaurantDAO;
import com.twogether.local7.review.dao.ReviewDAO;
import com.twogether.local7.review.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Autowired // RestaurantDAO 주입
    private RestaurantDAO restaurantDAO;

    @Override
    @Transactional
    public Mono<ReviewVO> addReview(ReviewVO review) {
        return Mono.fromCallable(() -> {
            // AI Service가 주입된 경우에만 요약 및 키워드 추출 로직 실행
            if (aiService != null) {
                AiReviewRequest aiRequest = new AiReviewRequest();
                aiRequest.setReview_text(review.getReviewContent());

                try {
                    // AI 서비스 호출을 try-catch로 감싸서 실패해도 리뷰 저장은 진행
                    AiReviewResponse aiResponse = aiService.summarizeReview(aiRequest).block();
                    if (aiResponse != null) {
                        review.setAiSummary(aiResponse.getSummary());
                        review.setAiKeywords(String.join(", ", aiResponse.getKeywords()));
                    }
                } catch (Exception e) {
                    logger.error("AI 서비스 호출 중 오류 발생. 리뷰는 AI 요약 없이 저장됩니다: {}", e.getMessage());
                    // AI 요약/키워드 필드를 null 또는 빈 값으로 설정 (선택 사항)
                    review.setAiSummary(null);
                    review.setAiKeywords(null);
                }
            }
            reviewDAO.insertReview(review);
            logger.info("ReviewService: 리뷰 등록 성공, ID: {}", review.getReviewId());

            // 음식점 통계 업데이트 로직 호출 (리뷰 추가 후)
            updateRestaurantStats(review.getRestaurantId());

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

    // 특정 맛집의 리뷰를 제한된 개수만큼 조회하는 메서드 구현
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
    @Transactional // 트랜잭션 처리
    public Mono<ReviewVO> updateReview(ReviewVO review) {
        return Mono.fromCallable(() -> {
            logger.info("ReviewService: updateReview 호출 - {}", review);
            // AI Service가 주입된 경우에만 요약 및 키워드 추출 로직 실행 (수정 시에도 필요하다면)
            if (aiService != null && review.getReviewContent() != null) {
                AiReviewRequest aiRequest = new AiReviewRequest();
                aiRequest.setReview_text(review.getReviewContent());

                try {
                    // AI 서비스 호출을 try-catch로 감싸서 실패해도 리뷰 저장은 진행
                    AiReviewResponse aiResponse = aiService.summarizeReview(aiRequest).block();
                    if (aiResponse != null) {
                        review.setAiSummary(aiResponse.getSummary());
                        review.setAiKeywords(String.join(", ", aiResponse.getKeywords()));
                    }
                } catch (Exception e) {
                    logger.error("AI 서비스 호출 중 오류 발생. 리뷰는 AI 요약 없이 업데이트됩니다: {}", e.getMessage());
                    // AI 요약/키워드 필드를 null 또는 빈 값으로 설정 (선택 사항)
                    review.setAiSummary(null);
                    review.setAiKeywords(null);
                }
            }
            reviewDAO.updateReview(review);
            logger.info("ReviewService: 리뷰 업데이트 성공, ID: {}", review.getReviewId());

            // 음식점 통계 업데이트 로직 호출 (리뷰 수정 후)
            updateRestaurantStats(review.getRestaurantId());

            return review;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    @Transactional
    public Mono<Void> deleteReview(Long reviewId) {
        return Mono.fromRunnable(() -> {
            logger.info("ReviewService: deleteReview 호출 - reviewId: {}", reviewId);
            // 삭제할 리뷰의 restaurantId를 먼저 조회
            ReviewVO reviewToDelete = reviewDAO.findReviewById(reviewId); // findReviewById 메서드 필요
            if (reviewToDelete != null) {
                reviewDAO.deleteReview(reviewId);
                logger.info("ReviewService: 리뷰 삭제 성공, ID: {}", reviewId);

                // 음식점 통계 업데이트 로직 호출 (리뷰 삭제 후)
                updateRestaurantStats(reviewToDelete.getRestaurantId());
            } else {
                logger.warn("ReviewService: 삭제할 리뷰를 찾을 수 없습니다, ID: {}", reviewId);
                throw new IllegalArgumentException("삭제할 리뷰를 찾을 수 없습니다.");
            }
        }).subscribeOn(Schedulers.boundedElastic()).then();
    }

    private void updateRestaurantStats(Long restaurantId) {
        if (restaurantId == null) {
            logger.warn("Restaurant ID is null, cannot update restaurant stats.");
            return;
        }
        // 해당 음식점의 모든 리뷰를 다시 조회하여 평균 평점과 총 리뷰 수를 계산
        List<ReviewVO> reviews = reviewDAO.findReviewsByRestaurantId(restaurantId);

        double newAverageRating = 0.0;
        if (!reviews.isEmpty()) {
            newAverageRating = reviews.stream()
                    .mapToDouble(ReviewVO::getReviewRating)
                    .average()
                    .orElse(0.0);
        }
        int newTotalComments = reviews.size();

        // RestaurantDAO를 통해 TB_RESTAURANT 테이블 업데이트
        restaurantDAO.updateRestaurantRatingAndComments(restaurantId, newAverageRating, newTotalComments);
        logger.info("RestaurantService: Restaurant ID {}의 통계 업데이트 완료. 평균 평점: {}, 총 리뷰 수: {}",
                restaurantId, String.format("%.1f", newAverageRating), newTotalComments);
    }
}
