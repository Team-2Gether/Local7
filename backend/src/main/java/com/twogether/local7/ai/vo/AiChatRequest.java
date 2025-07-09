package com.twogether.local7.ai.vo;

import lombok.*;

@Data
public class AiChatRequest {

    // FastAPI의 ChatRequest 모델과 일치: message: str
    private String message;

}