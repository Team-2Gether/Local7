package com.twogether.local7.restaurant.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RestaurantVO {
    private Long restaurantId;          // RESTAURANT_ID NUMBER NOT NULL PRIMARY KEY
    private String restaurantName;      // RESTAURANT_NAME VARCHAR2(100) NOT NULL
    private String addrSido;            // ADDR_SIDO VARCHAR2(30)
    private String addrSigungu;         // ADDR_SIGUNGU VARCHAR2(30)
    private String addrDong;            // ADDR_DONG VARCHAR2(30)
    private String addrDetail;          // ADDR_DETAIL VARCHAR2(200)
    private String phoneNumber;         // PHONE_NUMBER VARCHAR2(30)
    private String restaurantCategory;  // RESTAURANT_CATEGORY VARCHAR2(100)
    private BigDecimal restaurantLat;   // RESTAURANT_LAT NUMBER(10, 7)
    private BigDecimal restaurantLon;   // RESTAURANT_LON NUMBER(10, 7)
    private Integer openHour;           // OPEN_HOUR NUMBER(2)
    private Integer openMinute;         // OPEN_MINUTE NUMBER(2)
    private Integer closeHour;          // CLOSE_HOUR NUMBER(2)
    private Integer closeMinute;        // CLOSE_MINUTE NUMBER(2)
    private Integer breakStartHour;     // BREAK_START_HOUR NUMBER(2)
    private Integer breakStartMinute;   // BREAK_START_MINUTE NUMBER(2)
    private Integer breakEndHour;       // BREAK_END_HOUR NUMBER(2)
    private Integer breakEndMinute;     // BREAK_END_MINUTE NUMBER(2)
    private String restaurantHoliday;   // RESTAURANT_HOLIDAY VARCHAR2(100)
    private String parkingInfo;         // PARKING_INFO VARCHAR2(200)
    private LocalDateTime createdDate;  // CREATED_DATE TIMESTAMP
    private String createdId;           // CREATED_ID VARCHAR2(100)
    private LocalDateTime updatedDate;  // UPDATED_DATE TIMESTAMP
    private String updatedId;           // UPDATED_ID VARCHAR2(100)
}