package com.twogether.sra.restaurant.service;

import com.twogether.sra.restaurant.vo.RestaurantVO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RestaurantService {
    Mono<List<RestaurantVO>> getAllRestaurants();
}