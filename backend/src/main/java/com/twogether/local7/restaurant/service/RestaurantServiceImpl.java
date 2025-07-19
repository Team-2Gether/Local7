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
    public Mono<Pagination<RestaurantVO>> getAllRestaurants(int page, int size) {
        SimplePageable pageable = new SimplePageable(page, size);

        // 전체 음식점 개수와 페이징된 목록을 비동기적으로 가져옵니다.
        Mono<Long> countMono = Mono.fromCallable(() -> restaurantDAO.countAllRestaurants());
        Mono<List<RestaurantVO>> listMono = Mono.fromCallable(() -> restaurantDAO.findAllRestaurants(pageable));

        // 두 Mono의 결과를 결합하여 Pagination 객체를 생성합니다.
        return Mono.zip(listMono, countMono)
                .map(tuple -> new Pagination<>(tuple.getT1(), pageable, tuple.getT2()));
    }
}