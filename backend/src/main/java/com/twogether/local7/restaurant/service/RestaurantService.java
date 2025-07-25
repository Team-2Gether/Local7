package com.twogether.local7.restaurant.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RestaurantService {
    // 모든 음식점 목록을 조회 (지도용)
    Mono<List<RestaurantVO>> getAllRestaurants();

    // 페이징 처리된 음식점 목록을 조회 (목록용)
    Mono<Pagination<RestaurantVO>> getAllRestaurantsPaginated(int page, int size);

    // 식당 이름으로 음식점 정보 조회
    Mono<RestaurantVO> getRestaurantByName(String restName); // Mono<RestaurantVO>로 변경

    // 식당 ID로 음식점 정보 조회
    Mono<RestaurantVO> getRestaurantById(Long restId); // Mono<RestaurantVO>로 변경

    // 특정 지역에서 평균 평점이 높은 음식점 목록 조회
    Mono<List<RestaurantVO>> getTopRatedRestaurantsByRegion(String regionName, int limit);

}