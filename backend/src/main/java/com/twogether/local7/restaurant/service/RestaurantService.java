package com.twogether.local7.restaurant.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RestaurantService {
    Mono<Pagination<RestaurantVO>> getAllRestaurants(int page, int size);
}