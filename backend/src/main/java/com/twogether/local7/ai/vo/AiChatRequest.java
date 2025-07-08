package com.twogether.local7.ai.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {

    // FastAPI의 ChatRequest 모델과 일치: message: str
    private String message;

}