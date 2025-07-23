package com.twogether.local7.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration; // 추가
import org.springframework.web.cors.CorsConfigurationSource; // 추가
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // 추가
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken; // 추가
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService; // 추가
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient; // 추가

import java.util.Arrays; // 추가
import java.util.Collections; // 추가

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final OAuth2AuthorizedClientService authorizedClientService; // 추가

    public SecurityConfig(UserDetailsService userDetailsService, OAuth2AuthorizedClientService authorizedClientService) { // 생성자 수정
        this.userDetailsService = userDetailsService;
        this.authorizedClientService = authorizedClientService; // 초기화
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/loginFailure", "/api/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // Google 로그인 성공 후 백엔드 컨트롤러 엔드포인트로 리다이렉트
                        .defaultSuccessUrl("http://localh  ost:8080/api/auth/login/oauth2/code/google", true)
                        .successHandler((request, response, authentication) -> {
                            if (authentication instanceof OAuth2AuthenticationToken) {
                                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                                String clientRegistrationId = oauthToken.getAuthorizedClientRegistrationId();

                                // OAuth2AuthorizedClientService를 사용하여 OAuth2AuthorizedClient를 조회
                                OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                                        clientRegistrationId, oauthToken.getName());

                                if ("kakao".equals(clientRegistrationId)) {
                                    response.sendRedirect("http://localhost:8080/api/auth/login/oauth2/code/kakao");
                                } else if ("google".equals(clientRegistrationId)) {
                                    response.sendRedirect("http://localhost:8080/api/auth/login/oauth2/code/google");
                                } else {
                                    // 다른 OAuth2 공급자에 대한 기본 처리 또는 오류 처리
                                    response.sendRedirect("http://localhost:3000/");
                                }
                            } else {
                                // 일반 로그인 또는 다른 인증 방식에 대한 처리
                                response.sendRedirect("http://localhost:3000/"); // 기본 리다이렉션
                            }
                        })
                        .failureUrl("/loginFailure")
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID", "XSRF-TOKEN")
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}