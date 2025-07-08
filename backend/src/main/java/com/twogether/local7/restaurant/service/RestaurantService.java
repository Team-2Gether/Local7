package com.twogether.local7.restaurant.service;

import com.twogether.local7.restaurant.vo.RestaurantVO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RestaurantService {
    Mono<List<RestaurantVO>> getAllRestaurants();
}