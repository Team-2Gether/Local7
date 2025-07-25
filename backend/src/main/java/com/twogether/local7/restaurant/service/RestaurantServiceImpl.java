package com.twogether.local7.restaurant.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.restaurant.dao.RestaurantDAO;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantDAO restaurantDAO;

    @Override
    public Mono<List<RestaurantVO>> getAllRestaurants() {
        // 지도 렌더링용: 모든 음식점 목록을 비동기적으로 가져옵니다.
        return Mono.fromCallable(() -> restaurantDAO.findAllRestaurants());
    }

    @Override
    public Mono<Pagination<RestaurantVO>> getAllRestaurantsPaginated(int page, int size) {
        SimplePageable pageable = new SimplePageable(page, size);

        // 전체 음식점 개수와 페이징된 목록을 비동기적으로 가져옴
        Mono<Long> countMono = Mono.fromCallable(() -> restaurantDAO.countAllRestaurants());
        Mono<List<RestaurantVO>> listMono = Mono.fromCallable(() -> restaurantDAO.findAllRestaurantsPaginated(pageable));

        // 두 Mono의 결과를 결합하여 Pagination 객체를 생성
        return Mono.zip(listMono, countMono)
                .map(tuple -> new Pagination<>(tuple.getT1(), pageable, tuple.getT2()));
    }

    @Override
    public Mono<RestaurantVO> getRestaurantByName(String restName) {
        // 식당 이름으로 조회하는 DAO 메서드 호출
        return Mono.fromCallable(() -> restaurantDAO.findRestaurantByName(restName));
    }

    @Override
    public Mono<RestaurantVO> getRestaurantById(Long restId) {
        // 식당 ID로 조회하는 DAO 메서드 호출
        return Mono.fromCallable(() -> restaurantDAO.findRestaurantById(restId));
    }

    @Override
    public Mono<List<RestaurantVO>> getTopRatedRestaurantsByRegion(String regionName, int limit) {
        // 특정 지역에서 평균 평점이 높은 음식점 목록을 조회하는 DAO 메서드 호출
        return Mono.fromCallable(() -> restaurantDAO.findTopRatedRestaurantsByRegion(regionName, limit));
    }
}
