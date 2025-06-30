package com.twogether.sra.ai.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiReviewRequest {

    // FastAPI의 ReviewRequest 모델과 일치: review_text: str
    private String review_text;

}