package com.twogether.sra.restaurant.vo;

import lombok.Data;
import java.math.BigDecimal; // For NUMBER(10,7) latitude/longitude

@Data
public class RestaurantVO {
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhoneNumber;
    private String restaurantCategory;
    private BigDecimal restaurantLatitude;  // NUMBER(10,7) 매핑
    private BigDecimal restaurantLongitude; // NUMBER(10,7) 매핑
    private String restaurantOpenHours;
    private String restaurantBreakTime;
    private String restaurantHoliday;
    private String restaurantParkingInfo;
    private BigDecimal restaurantAverageRating; // NUMBER(2,1) 매핑
    private Integer restaurantReviewCount;
    // createdDate, createdId, updatedDate, updatedId는 필요에 따라 추가
}