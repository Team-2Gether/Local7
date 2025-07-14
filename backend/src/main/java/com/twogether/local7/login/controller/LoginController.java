package com.twogether.local7.login.controller;

import com.twogether.local7.login.service.LoginService;
import com.twogether.local7.login.vo.LoginVO;
import jakarta.servlet.http.HttpSession; // HttpSession import
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
    public ResponseEntity<? extends Map<String,? extends Object>> login(@RequestBody Map<String, String> loginRequest, HttpSession session) { // HttpSession 추가
        String credential = loginRequest.get("credential");
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요."));
        }

        try {
            LoginVO user = loginService.login(credential, password);

            // 로그인 성공 시 HttpSession에 사용자 정보 저장
            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userLoginId", user.getUserLoginId());
            session.setAttribute("userName", user.getUserName());
            session.setAttribute("userNickname", user.getUserNickname());
            session.setAttribute("userEmail", user.getUserEmail());
            session.setAttribute("userProfileImageUrl", user.getUserProfileImageUrl());
            session.setAttribute("userBio", user.getUserBio());
            session.setAttribute("ruleId", user.getRuleId());
            session.setAttribute("createDate", user.getCreateDate());
            session.setAttribute("createdId", user.getCreatedId());
            session.setAttribute("updatedDate", user.getUpdatedDate());
            session.setAttribute("updatedId", user.getUpdatedId());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "로그인 성공");
            // 클라이언트에 사용자 정보 반환 (App.js에서 상태 업데이트를 위해 필요)
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
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) { // HttpSession 추가
        // HttpSession 무효화
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(createSuccessResponse("로그아웃되었습니다."));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, ?>> checkLoginStatus(HttpSession session) { // HttpSession 추가
        Map<String, Object> response = new HashMap<>();
        Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");

        if (isLoggedIn != null && isLoggedIn) {
            // 세션에 저장된 사용자 정보 반환
            response.put("isLoggedIn", true);
            response.put("userId", session.getAttribute("userId"));
            response.put("userLoginId", session.getAttribute("userLoginId"));
            response.put("userName", session.getAttribute("userName"));
            response.put("userNickname", session.getAttribute("userNickname"));
            response.put("ruleId", session.getAttribute("ruleId"));
            response.put("userEmail", session.getAttribute("userEmail"));
            response.put("userProfileImageUrl", session.getAttribute("userProfileImageUrl"));
            response.put("userBio", session.getAttribute("userBio"));
            response.put("createDate", session.getAttribute("createDate"));
            response.put("createdId", session.getAttribute("createdId"));
            response.put("updatedDate", session.getAttribute("updatedDate"));
            response.put("updatedId", session.getAttribute("updatedId"));
            return ResponseEntity.ok(response);
        } else {
            response.put("isLoggedIn", false);
            return ResponseEntity.ok(response);
        }
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