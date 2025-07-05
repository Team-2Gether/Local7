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
@RequestMapping("/api/user") // Changed base mapping for user-related actions
public class UserController {

    @Autowired
    private UserService userService;

    // Login endpoint
    @PostMapping("/login")
    public Mono<ResponseEntity<? extends Map<String,? extends Object>>> login(@RequestBody Map<String, String> loginRequest, HttpSession session) { // Add HttpSession parameter
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
                        // Store user information in session
                        session.setAttribute("loggedInUser", user.getUserId()); // Store user ID
                        session.setAttribute("userLoginId", user.getUserLoginId()); //
                        session.setAttribute("userUsername", user.getUserUsername()); //
                        session.setAttribute("userNickname", user.getUserNickname()); //
                        session.setAttribute("isLoggedIn", true); // Set a flag for login status

                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "success");
                        response.put("message", "로그인 성공!");
                        // Optionally, return some user details to the client, but avoid sensitive info
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("userId", user.getUserId());
                        userData.put("userLoginId", user.getUserLoginId());
                        userData.put("userUsername", user.getUserUsername());
                        userData.put("userNickname", user.getUserNickname());
                        response.put("user", userData); // Return user info (without password)
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

    // Logout endpoint
    @PostMapping("/logout")
    public Mono<ResponseEntity<Map<String, String>>> logout(HttpSession session) { // Add HttpSession parameter
        session.invalidate(); // Invalidate the current session
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "로그아웃 되었습니다.");
        return Mono.just(ResponseEntity.ok(response));
    }

    // Endpoint to check login status (optional, for client-side verification)
    @GetMapping("/status")
    public Mono<ResponseEntity<Map<String, Object>>> getLoginStatus(HttpSession session) { // Add HttpSession parameter
        Map<String, Object> response = new HashMap<>();
        if (session.getAttribute("isLoggedIn") != null && (Boolean) session.getAttribute("isLoggedIn")) { // Check session attribute
            response.put("isLoggedIn", true);
            response.put("userLoginId", session.getAttribute("userLoginId"));
            response.put("userUsername", session.getAttribute("userUsername"));
            response.put("userNickname", session.getAttribute("userNickname"));
            return Mono.just(ResponseEntity.ok(response));
        } else {
            response.put("isLoggedIn", false);
            return Mono.just(ResponseEntity.ok(response));
        }
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