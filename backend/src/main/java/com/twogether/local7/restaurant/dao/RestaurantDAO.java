package com.twogether.local7.restaurant.dao;

import com.twogether.local7.pagintion.Pageable;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RestaurantDAO {
    // 모든 음식점 목록 조회 (지도 렌더링용)
    List<RestaurantVO> findAllRestaurants();

    // 페이징된 음식점 목록 조회 (목록 렌더링용)
    List<RestaurantVO> findAllRestaurantsPaginated(@Param("pageable") Pageable pageable);

    // 전체 음식점 개수 조회 (페이징용)
    long countAllRestaurants();

    // 특정 카테고리의 음식점 목록 조회 (확장성을 고려하여 추가)
    List<RestaurantVO> findRestaurantsByCategory(String category);

    // 식당 이름으로 음식점 정보 조회
    RestaurantVO findRestaurantByName(String restName);

    // 식당 ID로 음식점 정보 조회
    RestaurantVO findRestaurantById(Long restId);

    // 특정 지역에서 평균 평점이 높은 음식점 목록 조회
    List<RestaurantVO> findTopRatedRestaurantsByRegion(@Param("regionName") String regionName, @Param("limit") int limit);

    void updateRestaurantRatingAndComments(@Param("restaurantId") Long restaurantId,
                                           @Param("averageRating") Double averageRating,
                                           @Param("totalComments") Integer totalComments);
}