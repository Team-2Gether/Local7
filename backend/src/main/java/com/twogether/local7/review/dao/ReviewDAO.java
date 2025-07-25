package com.twogether.local7.review.dao;

import com.twogether.local7.review.vo.ReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewDAO {

    // 새로운 리뷰 추가
    void insertReview(ReviewVO review);

    // 특정 맛집의 모든 리뷰 조회
    List<ReviewVO> findReviewsByRestaurantId(Long restaurantId);

    // 전체 리뷰 조회 메서드 추가
    List<ReviewVO> findAllReviews();

    // 특정 사용자의 모든 리뷰 조회 (마이페이지 등에서 활용 가능)
    List<ReviewVO> findReviewsByUserId(Long userId);

    // 리뷰 수정
    void updateReview(ReviewVO review);

    // 리뷰 삭제
    void deleteReview(Long reviewId);

    List<ReviewVO> findReviewsByRestaurantIdWithLimit(@Param("restaurantId") Long restaurantId, @Param("limit") int limit);
}