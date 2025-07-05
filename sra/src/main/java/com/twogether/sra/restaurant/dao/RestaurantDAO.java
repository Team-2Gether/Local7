// src/main/java/com/twogether/sra/restaurant/dao/RestaurantDAO.java
package com.twogether.sra.restaurant.dao;

import com.twogether.sra.restaurant.vo.RestaurantVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RestaurantDAO {
    // 모든 음식점 목록 조회
    List<RestaurantVO> findAllRestaurants();

    // 특정 카테고리의 음식점 목록 조회 (확장성을 고려하여 추가)
    List<RestaurantVO> findRestaurantsByCategory(String category);
}