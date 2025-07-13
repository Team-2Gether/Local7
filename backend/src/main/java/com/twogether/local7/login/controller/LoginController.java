package com.twogether.local7.login.controller;

import com.twogether.local7.login.service.LoginService;
import com.twogether.local7.login.vo.LoginVO;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<? extends Map<String,? extends Object>> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String credential = loginRequest.get("credential");
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요."));
        }

        try {
            LoginVO user = loginService.login(credential, password);

            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userLoginId", user.getUserLoginId());
            session.setAttribute("userName", user.getUserName());
            session.setAttribute("userNickname", user.getUserNickname());
            session.setAttribute("userRule", user.getRuleName());
            session.setAttribute("userEmail",user.getUserEmail());
            session.setAttribute("userProfileImageUrl", user.getUserProfileImageUrl());
            session.setAttribute("userBio", user.getUserBio());
            session.setAttribute("createDate", user.getCreateDate());
            session.setAttribute("createdId", user.getCreatedId());
            session.setAttribute("updatedDate", user.getUpdatedDate());
            session.setAttribute("updatedId", user.getUpdatedId());

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("status", "success");
            successResponse.put("message", "로그인 성공!");
            successResponse.put("user", user);
            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            System.err.println("Login error: " + e.getMessage());
            if (e.getMessage() != null) {
                if (e.getMessage().contains("User not found") || e.getMessage().contains("사용자 정보를 찾을 수 없거나 비밀번호가 일치하지 않습니다.")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(createErrorResponse("user_not_found", "아이디/이메일 또는 비밀번호가 일치하지 않습니다."));
                } else if (e.getMessage().contains("Password mismatch")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(createErrorResponse("password_mismatch", "비밀번호가 일치하지 않습니다."));
                }
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("internal_error", "로그인 처리 중 서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "로그아웃 되었습니다.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getLoginStatus(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        if (session.getAttribute("isLoggedIn") != null && (Boolean) session.getAttribute("isLoggedIn")) {
            response.put("isLoggedIn", true);
            response.put("userId", session.getAttribute("userId"));
            response.put("userLoginId", session.getAttribute("userLoginId"));
            response.put("userName", session.getAttribute("userName"));
            response.put("userNickname", session.getAttribute("userNickname"));
            response.put("userRule", session.getAttribute("userRule"));
            response.put("userEmail",session.getAttribute("userEmail"));
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