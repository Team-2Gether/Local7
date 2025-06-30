package com.twogether.sra.ai.service;

import com.twogether.sra.ai.vo.AiChatRequest;
import com.twogether.sra.ai.vo.AiChatResponse;
import com.twogether.sra.ai.vo.AiReviewRequest;
import com.twogether.sra.ai.vo.AiReviewResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AiService {

    private final WebClient webClient;

    @Autowired
    public AiService(WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * FastAPI AI 서버의 /chat 엔드포인트를 호출하여 AI 챗봇 응답을 받음
     * @param request AI 챗봇에게 보낼 메시지 (AiChatRequest VO 객체)
     * @return AI 챗봇의 응답 (AiChatResponse VO 객체)
     */
    public Mono<AiChatResponse> getChatResponse(AiChatRequest request) {
        return webClient.post() // POST 요청 시작
                .uri("/chat")   // 호출할 엔드포인트 URI
                .bodyValue(request) // 요청 바디에 AiChatRequest 객체를 JSON으로 변환하여 포함
                .retrieve()     // 응답을 받아옴
                .bodyToMono(AiChatResponse.class); // 응답 바디를 AiChatResponse 클래스로 변환
    }

    /**
     * FastAPI AI 서버의 /summarize-review 엔드포인트를 호출하여 리뷰 요약 및 키워드를 받음.
     * @param request 요약할 리뷰 텍스트 (AiReviewRequest VO 객체)
     * @return 요약된 리뷰 및 키워드 (AiReviewResponse VO 객체)
     */
    public Mono<AiReviewResponse> summarizeReview(AiReviewRequest request) {
        return webClient.post()
                .uri("/summarize-review")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiReviewResponse.class);
    }

}