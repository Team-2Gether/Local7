package com.twogether.local7.restaurant.dao;

import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RestaurantDAO {
    // 모든 음식점 목록 조회
    List<RestaurantVO> findAllRestaurants(@Param("pageable") SimplePageable pageable);

    // 전체 음식점 개수 조회
    long countAllRestaurants();

    // 특정 카테고리의 음식점 목록 조회 (확장성을 고려하여 추가)
    List<RestaurantVO> findRestaurantsByCategory(String category);
}