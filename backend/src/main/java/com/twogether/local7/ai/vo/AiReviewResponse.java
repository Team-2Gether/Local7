package com.twogether.local7.ai.vo;

import lombok.*;

import java.util.List;

@Data
public class AiReviewResponse {

    // FastAPI 응답 JSON 필드: {"summary": "..."}
    private String summary;

    // FastAPI 응답 JSON 필드: {"keywords": ["...", "..."]}
    private List<String> keywords;

}