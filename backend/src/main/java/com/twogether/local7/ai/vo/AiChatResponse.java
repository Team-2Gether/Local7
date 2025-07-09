package com.twogether.local7.ai.vo;

import lombok.*;

@Data
public class AiChatResponse {

    // FastAPI의 응답 JSON 필드와 일치: {"response": "..."}
    private String response;

}