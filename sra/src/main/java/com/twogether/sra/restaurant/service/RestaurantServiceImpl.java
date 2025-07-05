package com.twogether.sra.restaurant.service;

import com.twogether.sra.restaurant.dao.RestaurantDAO;
import com.twogether.sra.restaurant.vo.RestaurantVO;
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
        // 비동기적으로 데이터베이스에서 음식점 목록을 가져옵니다.
        return Mono.fromCallable(() -> restaurantDAO.findAllRestaurants());
    }
}