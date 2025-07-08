package com.twogether.local7.ai.service;

import com.twogether.local7.ai.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final WebClient webClient;

    @Autowired
    // @Value를 생성자 파라미터에 직접 붙여서 값을 주입
    public AiService(WebClient.Builder webClientBuilder, @Value("${ai.server.url}") String aiServerUrl) {
        // 이제 aiServerUrl은 생성자 호출 시점에 이미 값을 가지고 있음
        logger.info("AI Server URL: {}", aiServerUrl);
        this.webClient = webClientBuilder.baseUrl(aiServerUrl).build();
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

    /**
     * FastAPI AI 서버의 /analyze-sentiment 엔드포인트를 호출하여 텍스트 감성을 분석
     * @param request 감성을 분석할 텍스트 (SentimentRequest VO 객체)
     * @return 분석된 감성 (SentimentResponse VO 객체)
     */
    public Mono<SentimentResponse> analyzeSentiment(SentimentRequest request) {
        return webClient.post()
                .uri("/analyze-sentiment") // FastAPI의 새 엔드포인트 URI
                .bodyValue(request)
                .retrieve()
                .bodyToMono(SentimentResponse.class);
    }

}