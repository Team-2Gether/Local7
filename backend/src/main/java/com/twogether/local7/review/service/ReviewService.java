package com.twogether.local7.review.service;

import com.twogether.local7.review.vo.ReviewVO;
import reactor.core.publisher.Mono;
import java.util.List;

public interface ReviewService {

    Mono<ReviewVO> addReview(ReviewVO review);

    Mono<List<ReviewVO>> getReviewsByRestaurantId(Long restaurantId);

    Mono<ReviewVO> updateReview(ReviewVO review);

    Mono<Void> deleteReview(Long reviewId);

}