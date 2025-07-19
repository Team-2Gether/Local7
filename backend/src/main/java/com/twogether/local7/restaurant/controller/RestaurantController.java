package com.twogether.local7.restaurant.controller;

import com.twogether.local7.restaurant.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/restaurants") // 음식점 관련 API 엔드포인트
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public Mono<ResponseEntity<Map<String, Object>>> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        return restaurantService.getAllRestaurants(page, size)
                .map(pagination -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "음식점 목록 조회 성공");
                    response.put("data", pagination);
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "음식점 목록 조회 중 오류 발생: " + e.getMessage());
                    return Mono.just(ResponseEntity.internalServerError().body(errorResponse));
                });
    }
}