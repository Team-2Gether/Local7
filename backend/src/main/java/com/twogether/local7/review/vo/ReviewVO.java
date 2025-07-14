package com.twogether.local7.review.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewVO {

    private Long reviewId;              // REVIEW_ID NUMBER NOT NULL PRIMARY KEY
    private Long userId;                // USER_ID NUMBER NOT NULL
    private Long restaurantId;          // RESTAURANT_ID NUMBER NOT NULL
    private Double reviewRating;        // REVIEW_RATING NUMBER(2, 1) NOT NULL
    private String reviewContent;       // REVIEW_CONTENT CLOB NOT NULL
    private String aiSummary;           // AI_SUMMARY CLOB
    private String aiKeywords;          // AI_KEYWORDS VARCHAR2(500)
    private LocalDateTime createdDate;  // CREATED_DATE TIMESTAMP
    private String createdId;           // CREATED_ID VARCHAR2(100)
    private LocalDateTime updatedDate;  // UPDATED_DATE TIMESTAMP
    private String updatedId;           // UPDATED_ID VARCHAR2(100)
    private String userNickname;
}