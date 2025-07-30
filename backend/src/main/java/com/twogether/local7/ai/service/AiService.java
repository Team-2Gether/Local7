package com.twogether.local7.ai.service;

import com.twogether.local7.ai.vo.AiChatRequest;
import com.twogether.local7.ai.vo.AiChatResponse;
import com.twogether.local7.ai.vo.AiReviewRequest;
import com.twogether.local7.ai.vo.AiReviewResponse;
import com.twogether.local7.ai.vo.SentimentRequest;
import com.twogether.local7.ai.vo.SentimentResponse;
import com.twogether.local7.restaurant.service.RestaurantService;
import com.twogether.local7.review.service.ReviewService;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.Arrays;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final WebClient webClient;
    private final RestaurantService restaurantService;
    private final ReviewService reviewService;

    @Autowired
    public AiService(WebClient.Builder webClientBuilder,
                     @Value("${ai.server.url}") String aiServerUrl,
                     RestaurantService restaurantService,
                     @Lazy ReviewService reviewService) {
        logger.info("AI Server URL: {}", aiServerUrl);
        this.webClient = webClientBuilder.baseUrl(aiServerUrl).build();
        this.restaurantService = restaurantService;
        this.reviewService = reviewService;
    }

    /**
     * FastAPI AI 서버의 /chat 엔드포인트를 호출하여 AI 챗봇 응답을 받음
     * 사용자의 메시지에서 식당 정보를 추출하여 AI 서버로 함께 전달합니다.
     * @param request AI 챗봇에게 보낼 메시지 (AiChatRequest VO 객체)
     * @return AI 챗봇의 응답 (AiChatResponse VO 객체)
     */
    public Mono<AiChatResponse> getChatResponse(AiChatRequest request) {
        String userMessage = request.getMessage();
        List<RestaurantVO> relevantRestaurants = new ArrayList<>();
        List<ReviewVO> relevantReviews = new ArrayList<>();

        // filteredRestaurants 변수 선언
        List<RestaurantVO> filteredRestaurants = new ArrayList<>();


        // 7번 국도에 해당하는 주요 지역 목록
        List<String> nationalRoad7Regions = Arrays.asList(
                "강릉", "속초", "양양", "동해", "삼척", "울진", "영덕", "포항", "경주", "부산", "울산"
        );

        // 사용자 제공 카테고리 및 일반적인 음식 카테고리
        List<String> specificFoodCategories = Arrays.asList(
                "해산물", "닭갈비", "한식", "간식", "기사식당", "분식", "뷔페", "샤브샤브", "술집",
                "식품판매", "아시아 음식", "일식", "중식", "양식", "치킨", "패밀리레스토랑",
                "패스트푸드", "퓨전요리"
        );
        // 일반적인 장소 키워드
        List<String> generalPlaceKeywords = Arrays.asList("맛집", "음식점", "식당", "곳");

        String detectedRegion = null;
        String detectedCategory = null;

        // 1. 사용자 메시지에서 지역 탐지
        for (String region : nationalRoad7Regions) {
            if (userMessage.contains(region)) {
                detectedRegion = region;
                break;
            }
        }

        // 2. 사용자 메시지에서 음식 카테고리 탐지
        for (String category : specificFoodCategories) {
            if (userMessage.contains(category)) {
                detectedCategory = category;
                break;
            }
        }

        // 3. 탐지된 지역과 카테고리(또는 일반 맛집 키워드)를 기반으로 데이터 조회
        if (detectedRegion != null) {
            boolean isGeneralRestaurantQuery = generalPlaceKeywords.stream().anyMatch(userMessage::contains);

            if (detectedCategory != null || isGeneralRestaurantQuery) { // 카테고리가 탐지되었거나 일반 맛집 쿼리인 경우
                logger.info("일반 추천 쿼리 감지 - 지역: {}, 특정 음식 카테고리: {}", detectedRegion, detectedCategory);

                // 해당 지역의 최고 평점 맛집을 조회 (예: 상위 5개)
                List<RestaurantVO> topRestaurants = restaurantService.getTopRatedRestaurantsByRegion(detectedRegion, 5).block();

                // 특정 음식 카테고리가 언급된 경우, 조회된 식당 목록을 추가로 필터링
                if (topRestaurants != null && !topRestaurants.isEmpty()) {
                    if (detectedCategory != null) {
                        for (RestaurantVO rest : topRestaurants) {
                            // 식당의 카테고리가 사용자가 요청한 카테고리를 포함하는지 확인 (대소문자 무시)
                            if (rest.getRestaurantCategory() != null &&
                                    rest.getRestaurantCategory().toLowerCase().contains(detectedCategory.toLowerCase())) {
                                filteredRestaurants.add(rest);
                            }
                        }
                    } else {
                        // 특정 카테고리 언급이 없으면, 지역 내 최고 평점 식당 전체를 추가
                        filteredRestaurants.addAll(topRestaurants);
                    }

                    relevantRestaurants.addAll(filteredRestaurants);

                    if (!relevantRestaurants.isEmpty()) { // 관련 식당이 있는 경우에만 리뷰 조회
                        // 각 관련 식당에 대한 리뷰도 일부 가져오기
                        for (RestaurantVO restaurant : relevantRestaurants) {
                            List<ReviewVO> reviewsForRestaurant = reviewService.getReviewsByRestaurantId(restaurant.getRestaurantId(), 2).block(); // 각 식당당 2개 리뷰
                            if (reviewsForRestaurant != null) {
                                relevantReviews.addAll(reviewsForRestaurant);
                            }
                        }
                    } else {
                        logger.info("해당 지역 ({})의 {} 카테고리에 대한 인기 맛집 정보를 찾을 수 없습니다.", detectedRegion, detectedCategory);
                    }
                } else {
                    logger.info("해당 지역 ({})에 대한 인기 맛집 정보를 찾을 수 없습니다 (데이터베이스 조회 결과 없음).", detectedRegion);
                }
            }
        } else {
            // 4. 기존 로직: 특정 식당 이름 또는 ID로 조회 (일반 추천 쿼리가 매칭되지 않은 경우)
            Pattern restaurantNamePattern = Pattern.compile("(.+?) 식당");
            Matcher nameMatcher = restaurantNamePattern.matcher(userMessage);

            Pattern restaurantIdPattern = Pattern.compile("(\\d+)번? 식당");
            Matcher idMatcher = restaurantIdPattern.matcher(userMessage);

            if (nameMatcher.find()) {
                String restaurantName = nameMatcher.group(1).trim();
                RestaurantVO restaurant = restaurantService.getRestaurantByName(restaurantName).block();
                if (restaurant != null) {
                    relevantRestaurants.add(restaurant);
                    List<ReviewVO> reviews = reviewService.getReviewsByRestaurantId(restaurant.getRestaurantId(), 5).block();
                    if (reviews != null) {
                        relevantReviews.addAll(reviews);
                    }
                }
            } else if (idMatcher.find()) {
                try {
                    Long restaurantId = Long.parseLong(idMatcher.group(1));
                    RestaurantVO restaurant = restaurantService.getRestaurantById(restaurantId).block();
                    if (restaurant != null) {
                        relevantRestaurants.add(restaurant);
                        List<ReviewVO> reviews = reviewService.getReviewsByRestaurantId(restaurant.getRestaurantId(), 5).block();
                        if (reviews != null) {
                            relevantReviews.addAll(reviews);
                        }
                    }
                } catch (NumberFormatException e) {
                    logger.warn("메시지에서 식당 ID 파싱 실패: {}", idMatcher.group(1));
                }
            }
        }

        // 조회된 식당 및 리뷰 데이터를 AiChatRequest 객체에 설정
        request.setRestaurants(relevantRestaurants);
        request.setReviews(relevantReviews);

        logger.info("AI 서버로 채팅 요청 전송: {}", request.getMessage());
        if (!relevantRestaurants.isEmpty()) {
            logger.info("관련 식당 포함: {}", relevantRestaurants.stream().map(RestaurantVO::getRestaurantName).toList());
        }
        if (!relevantReviews.isEmpty()) {
            logger.info("관련 리뷰 포함 (상위 5개): {}", relevantReviews.stream().map(ReviewVO::getReviewContent).limit(5).toList());
        }

        return webClient.post()
                .uri("/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiChatResponse.class);
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
                .uri("/analyze-sentiment")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(SentimentResponse.class);
    }
}
