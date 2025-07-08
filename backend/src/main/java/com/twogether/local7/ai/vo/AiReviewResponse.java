package com.twogether.local7.ai.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiReviewResponse {

    // FastAPI 응답 JSON 필드: {"summary": "..."}
    private String summary;

    // FastAPI 응답 JSON 필드: {"keywords": ["...", "..."]}
    private List<String> keywords;

}