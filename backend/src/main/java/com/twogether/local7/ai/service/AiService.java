package com.twogether.local7.ai.service;

import com.twogether.local7.ai.vo.*;
import com.twogether.local7.restaurant.service.RestaurantService;
import com.twogether.local7.review.service.ReviewService;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy; // Lazy 어노테이션 추가
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;

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
                     @Lazy ReviewService reviewService) { // ReviewService에 @Lazy 추가
        logger.info("AI Server URL: {}", aiServerUrl);
        this.webClient = webClientBuilder.baseUrl(aiServerUrl).build();
        this.restaurantService = restaurantService;
        this.reviewService = reviewService;
    }

    public Mono<AiChatResponse> getChatResponse(AiChatRequest request) {
        String userMessage = request.getMessage();
        List<RestaurantVO> relevantRestaurants = new ArrayList<>();
        List<ReviewVO> relevantReviews = new ArrayList<>();

        Pattern restaurantNamePattern = Pattern.compile("(.+?) 식당");
        Matcher matcher = restaurantNamePattern.matcher(userMessage);

        Pattern restaurantIdPattern = Pattern.compile("(\\d+)번? 식당");
        Matcher idMatcher = restaurantIdPattern.matcher(userMessage);


        if (matcher.find()) {
            String restaurantName = matcher.group(1).trim();
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
                logger.warn("Failed to parse restaurant ID from message: {}", idMatcher.group(1));
            }
        }

        request.setRestaurants(relevantRestaurants);
        request.setReviews(relevantReviews);

        logger.info("Sending chat request to AI server with message: {}", request.getMessage());
        if (!relevantRestaurants.isEmpty()) {
            logger.info("Including relevant restaurants: {}", relevantRestaurants.stream().map(RestaurantVO::getRestaurantName).toList());
        }
        if (!relevantReviews.isEmpty()) {
            logger.info("Including relevant reviews (first 5): {}", relevantReviews.stream().map(ReviewVO::getReviewContent).limit(5).toList());
        }

        return webClient.post()
                .uri("/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiChatResponse.class);
    }

    public Mono<AiReviewResponse> summarizeReview(AiReviewRequest request) {
        return webClient.post()
                .uri("/summarize-review")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiReviewResponse.class);
    }

    public Mono<SentimentResponse> analyzeSentiment(SentimentRequest request) {
        return webClient.post()
                .uri("/analyze-sentiment")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(SentimentResponse.class);
    }
}
