package com.twogether.local7.ai.vo;

import lombok.*;

@Data
public class AiReviewRequest {

    // FastAPI의 ReviewRequest 모델과 일치: review_text: str
    private String review_text;

}