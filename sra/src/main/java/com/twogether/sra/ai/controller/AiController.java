package com.twogether.sra.ai.controller;

import com.twogether.sra.ai.service.AiService;
import com.twogether.sra.ai.vo.AiChatRequest;
import com.twogether.sra.ai.vo.AiChatResponse;
import com.twogether.sra.ai.vo.AiReviewRequest;
import com.twogether.sra.ai.vo.AiReviewResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService; // AiService 주입

    @Autowired // AiService 빈을 자동으로 주입받음
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * AI 챗봇과 대화하기 위한 엔드포인트
     * POST /api/ai/chat
     * 요청 예시: {"message": "안녕하세요"}
     * 응답 예시: {"response": "안녕하세요, 무엇을 도와드릴까요?"}
     */
    @PostMapping("/chat")
    public Mono<ResponseEntity<AiChatResponse>> chatWithAi(@RequestBody AiChatRequest request) {
        // AiService를 호출하여 AI 서버로부터 비동기 응답을 받음
        return aiService.getChatResponse(request)
                .map(response -> ResponseEntity.ok(response)); // 응답이 오면 HTTP 200 OK와 함께 반환
    }

    /**
     * 맛집 리뷰를 AI로 요약하고 키워드를 추출하기 위한 엔드포인트
     * POST /api/ai/summarize-review
     * 요청 예시: {"review_text": "이 식당 파스타 정말 맛있고 분위기도 좋아요!"}
     * 응답 예시: {"summary": "맛있는 파스타와 좋은 분위기.", "keywords": ["파스타", "분위기", "맛집"]}
     */
    @PostMapping("/summarize-review")
    public Mono<ResponseEntity<AiReviewResponse>> summarizeReview(@RequestBody AiReviewRequest request) {
        // AiService를 호출하여 AI 서버로부터 비동기 응답을 받음
        return aiService.summarizeReview(request)
                .map(response -> ResponseEntity.ok(response)); // 응답이 오면 HTTP 200 OK와 함께 반환
    }

}