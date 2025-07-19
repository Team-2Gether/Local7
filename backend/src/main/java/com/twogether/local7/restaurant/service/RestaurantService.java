package com.twogether.local7.restaurant.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RestaurantService {
    // 기존 메서드: 모든 음식점 목록을 조회 (지도용)
    Mono<List<RestaurantVO>> getAllRestaurants();

    // 새로 추가된 메서드: 페이징 처리된 음식점 목록을 조회 (목록용)
    Mono<Pagination<RestaurantVO>> getAllRestaurantsPaginated(int page, int size);
}