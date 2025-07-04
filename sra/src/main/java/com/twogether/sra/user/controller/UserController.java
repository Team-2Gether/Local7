// src/main/java/com/twogether/sra/user/controller/UserController.java
package com.twogether.sra.user.controller;

import com.twogether.sra.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user") // Changed base mapping for user-related actions
public class UserController {

    @Autowired
    private UserService userService;

    // Login endpoint
    @PostMapping("/login")
    public Mono<ResponseEntity<? extends Map<String,? extends Object>>> login(@RequestBody Map<String, String> loginRequest) {
        String credential = loginRequest.get("credential"); // Can be loginId or email
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요.")));
        }

        return userService.login(credential, password)
                .map(user -> {
                    if (user != null) {
                        // Login successful
                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "success");
                        response.put("message", "로그인 성공!");
                        response.put("user", user); // Return user info (without password)
                        return ResponseEntity.ok(response);
                    } else {
                        // Login failed (user not found or invalid password)
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(createErrorResponse("invalid_credentials", "아이디 또는 비밀번호가 올바르지 않습니다."));
                    }
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("login_failed", "로그인 처리 중 오류가 발생했습니다: " + e.getMessage()))));
    }

    // Helper method for consistent error response format
    private Map<String, String> createErrorResponse(String code, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", code);
        response.put("message", message);
        return response;
    }
}