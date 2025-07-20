package com.twogether.local7.review.service;

import com.twogether.local7.review.vo.ReviewVO;
import reactor.core.publisher.Mono;
import java.util.List;

public interface ReviewService {

    Mono<ReviewVO> addReview(ReviewVO review);

    Mono<List<ReviewVO>> getReviewsByRestaurantId(Long restaurantId);

    Mono<List<ReviewVO>> getAllReviews(); // 리뷰 전체 목록 조회 메서드 추가

    Mono<ReviewVO> updateReview(ReviewVO review);

    Mono<Void> deleteReview(Long reviewId);
}