package com.twogether.sra.ai.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {

    // FastAPI의 응답 JSON 필드와 일치: {"response": "..."}
    private String response;

}