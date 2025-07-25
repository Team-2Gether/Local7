package com.twogether.local7.ai.vo;

import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO;
import lombok.*;

import java.util.List;

@Data
public class AiChatRequest {

    // FastAPI의 ChatRequest 모델과 일치: message: str
    private String message;

    // AI가 참고할 식당 정보 리스트
    // 사용자가 특정 식당에 대해 질문했을 때, 해당 식당의 정보를 담아 보냅니다.
    private List<RestaurantVO> restaurants;

    // AI가 참고할 리뷰 정보 리스트
    // 특정 식당의 리뷰를 요청하거나, 식당 관련 질문 시 해당 식당의 리뷰를 담아 보냅니다.
    private List<ReviewVO> reviews;

    // 또는, 특정 식당 ID만 보내서 AI 서버가 직접 데이터를 조회하게 할 수도 있습니다.
    // private Long targetRestaurantId;
}