// src/main/java/com/twogether/sra/user/controller/UserController.java
package com.twogether.sra.user.controller;

import com.twogether.sra.user.service.UserService;
import com.twogether.sra.user.vo.UserVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Mono<ResponseEntity<? extends Map<String,? extends Object>>> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String credential = loginRequest.get("credential");
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요.")));
        }

        return userService.login(credential, password)
                .map(user -> {
                    if (user != null) {
                        // 로그인 성공: 세션에 사용자 정보 및 권한 정보 저장
                        session.setAttribute("isLoggedIn", true);
                        session.setAttribute("userLoginId", user.getUserLoginId());
                        session.setAttribute("userUsername", user.getUserUsername());
                        session.setAttribute("userNickname", user.getUserNickname());
                        session.setAttribute("userRule", user.getRuleName()); // 권한 이름 저장

                        Map<String, Object> successResponse = new HashMap<>();
                        successResponse.put("status", "success");
                        successResponse.put("message", "로그인 성공!");
                        successResponse.put("user", user); // UserVO (password removed, ruleName included)
                        return ResponseEntity.ok(successResponse);
                    } else {
                        // 로그인 실패
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(createErrorResponse("login_failed", "아이디/이메일 또는 비밀번호가 일치하지 않습니다."));
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("Login error: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(createErrorResponse("internal_error", "로그인 처리 중 서버 오류가 발생했습니다.")));
                });
    }

    @PostMapping("/logout")
    public Mono<ResponseEntity<Map<String, String>>> logout(HttpSession session) {
        session.invalidate(); // 현재 세션 무효화
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "로그아웃 되었습니다.");
        return Mono.just(ResponseEntity.ok(response));
    }

    @GetMapping("/status")
    public Mono<ResponseEntity<Map<String, Object>>> getLoginStatus(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        if (session.getAttribute("isLoggedIn") != null && (Boolean) session.getAttribute("isLoggedIn")) {
            response.put("isLoggedIn", true);
            response.put("userLoginId", session.getAttribute("userLoginId"));
            response.put("userUsername", session.getAttribute("userUsername"));
            response.put("userNickname", session.getAttribute("userNickname"));
            response.put("userRule", session.getAttribute("userRule")); // 세션에서 권한 이름 반환
            return Mono.just(ResponseEntity.ok(response));
        } else {
            response.put("isLoggedIn", false);
            return Mono.just(ResponseEntity.ok(response));
        }
    }

    private Map<String, String> createErrorResponse(String code, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", code);
        response.put("message", message);
        return response;
    }
}