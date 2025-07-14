package com.twogether.local7.login.controller;

import com.twogether.local7.login.service.LoginService;
import com.twogether.local7.login.vo.LoginVO;
import jakarta.servlet.http.HttpSession; // HttpSession import는 일단 유지, 사용하지 않을 예정
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // 인증 관련 URL이므로 auth로 변경
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<? extends Map<String,? extends Object>> login(@RequestBody Map<String, String> loginRequest) { // HttpSession 제거
        String credential = loginRequest.get("credential");
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요."));
        }

        try {
            LoginVO user = loginService.login(credential, password);

            // 세션 스토리지 사용으로 변경됨에 따라 서버 측 HttpSession에 사용자 정보를 저장하지 않습니다.
            // 클라이언트(React)에서 로그인 성공 후 응답받은 사용자 정보를 sessionStorage에 직접 저장합니다.

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "로그인 성공");
            // 클라이언트에 사용자 정보 반환 (sessionStorage 저장을 위해 필요)
            response.put("isLoggedIn", true);
            response.put("userId", user.getUserId());
            response.put("userLoginId", user.getUserLoginId());
            response.put("userName", user.getUserName());
            response.put("userNickname", user.getUserNickname());
            response.put("userEmail", user.getUserEmail());
            response.put("userProfileImageUrl", user.getUserProfileImageUrl());
            response.put("userBio", user.getUserBio());
            response.put("ruleId", user.getRuleId());
            response.put("createDate", user.getCreateDate());
            response.put("createdId", user.getCreatedId());
            response.put("updatedDate", user.getUpdatedDate());
            response.put("updatedId", user.getUpdatedId());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("login_failed", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("server_error", "로그인 중 서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() { // HttpSession 제거
        // 클라이언트(React)에서 sessionStorage를 직접 지우므로, 서버에서는 특별히 할 일 없음
        // 만약 서버 측 세션 ID 기반의 쿠키를 사용했다면 여기서 세션 무효화 로직이 필요하지만,
        // 현재는 클라이언트에서 상태를 관리하므로 단순 성공 응답만 반환
        return ResponseEntity.ok(createSuccessResponse("로그아웃되었습니다."));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, ?>> checkLoginStatus() { // HttpSession 제거
        Map<String, Object> response = new HashMap<>();
        // 클라이언트에서 sessionStorage를 통해 로그인 상태를 관리하므로,
        // 서버는 기본적으로 로그인되지 않은 상태를 반환합니다.
        // 실제 애플리케이션에서는 JWT 등 토큰 기반 인증을 사용하여 상태를 검증해야 합니다.
        response.put("isLoggedIn", false);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createErrorResponse(String code, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", code);
        response.put("message", message);
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", message);
        return response;
    }
}