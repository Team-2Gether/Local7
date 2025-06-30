package com.twogether.sra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000") // React 개발 서버의 출처 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 허용할 HTTP 메소드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 자격 증명 (쿠키, 인증 헤더 등) 허용
                .maxAge(3600); // Pre-flight 요청 결과를 캐싱할 시간 (초)
    }
}