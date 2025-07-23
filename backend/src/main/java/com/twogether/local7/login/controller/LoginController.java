package com.twogether.local7.login.controller;

import com.twogether.local7.login.service.LoginService;
import com.twogether.local7.login.vo.LoginVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.servlet.view.RedirectView; // RedirectView import 추가


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
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

            // 로그인 성공 시 HttpSession에 사용자 정보 저장
            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userLoginId", user.getUserLoginId());
            session.setAttribute("userName", user.getUsername());
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
            response.put("userName", user.getUsername());
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

    @GetMapping("/status")
    public ResponseEntity<Map<String, ?>> checkLoginStatus(HttpSession session) {
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

    // Google 로그인 성공 후 백엔드로 이동 -> 백엔드에서 프론트엔드로 리다이렉트
    @GetMapping("/login/oauth2/code/google")
    public RedirectView googleLoginSuccess(@AuthenticationPrincipal OAuth2User oauth2User, HttpSession session) {
        if (oauth2User != null) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            try {
                // OAuth 사용자 정보 처리 (신규 등록 또는 기존 사용자 업데이트)
                LoginVO user = loginService.processOAuthUser(email, name, picture);

                // 세션에 사용자 정보 저장
                session.setAttribute("isLoggedIn", true);
                session.setAttribute("userId", user.getUserId());
                session.setAttribute("userLoginId", user.getUserLoginId());
                session.setAttribute("userName", user.getUsername());
                session.setAttribute("userNickname", user.getUserNickname());
                session.setAttribute("userEmail", user.getUserEmail());
                session.setAttribute("userProfileImageUrl", user.getUserProfileImageUrl());
                session.setAttribute("userBio", user.getUserBio());
                session.setAttribute("ruleId", user.getRuleId());
                session.setAttribute("createDate", user.getCreateDate());
                session.setAttribute("createdId", user.getCreatedId());
                session.setAttribute("updatedDate", user.getUpdatedDate());
                session.setAttribute("updatedId", user.getUpdatedId());

                // 프론트엔드 메인 페이지로 리다이렉트
                return new RedirectView("http://localhost:3000/");
            } catch (Exception e) {
                System.err.println("Error processing Google OAuth user: " + e.getMessage());
                // 오류 발생 시 로그인 실패 페이지 또는 메인 페이지로 리다이렉트 (필요에 따라 변경)
                return new RedirectView("http://localhost:3000/login"); // 예시: 로그인 페이지로 리다이렉트
            }
        } else {
            // OAuth2User가 null인 경우 (로그인 실패)
            return new RedirectView("http://localhost:3000/login"); // 예시: 로그인 페이지로 리다이렉트
        }
    }

    // 카카오 로그인 성공 후 백엔드로 이동 -> 백엔드에서 프론트엔드로 리다이렉트
    @GetMapping("/login/oauth2/code/kakao")
    public RedirectView kakaoLoginSuccess(@AuthenticationPrincipal OAuth2User oauth2User, HttpSession session) {
        if (oauth2User != null) {
            Map<String, Object> kakaoAccount = oauth2User.getAttribute("kakao_account");
            String email = null;
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email"); // 이메일은 null일 수 있음
            }

            Map<String, Object> profile = oauth2User.getAttribute("properties");
            String nickname = null;
            String profileImage = null;
            if (profile != null) {
                nickname = (String) profile.get("nickname");
                profileImage = (String) profile.get("profile_image");
            }

            try {
                // OAuth 사용자 정보 처리 (신규 등록 또는 기존 사용자 업데이트)
                // 카카오 로그인 시 이메일은 null일 수 있으므로, email이 null이면 nickname을 userLoginId로 사용
                // processOAuthUser의 첫번째 인자 (email)를 null 허용하도록 변경
                LoginVO user = loginService.processOAuthUser(email, nickname, profileImage);

                // 세션에 사용자 정보 저장
                session.setAttribute("isLoggedIn", true);
                session.setAttribute("userId", user.getUserId());
                session.setAttribute("userLoginId", user.getUserLoginId());
                session.setAttribute("userName", user.getUsername());
                session.setAttribute("userNickname", user.getUserNickname());
                session.setAttribute("userEmail", user.getUserEmail());
                session.setAttribute("userProfileImageUrl", user.getUserProfileImageUrl());
                session.setAttribute("userBio", user.getUserBio());
                session.setAttribute("ruleId", user.getRuleId());
                session.setAttribute("createDate", user.getCreateDate());
                session.setAttribute("createdId", user.getCreatedId());
                session.setAttribute("updatedDate", user.getUpdatedDate());
                session.setAttribute("updatedId", user.getUpdatedId());

                // 프론트엔드 메인 페이지로 리다이렉트
                return new RedirectView("http://localhost:3000/");
            } catch (Exception e) {
                System.err.println("Error processing Kakao OAuth user: " + e.getMessage());
                // 오류 발생 시 로그인 실패 페이지 또는 메인 페이지로 리다이렉트 (필요에 따라 변경)
                return new RedirectView("http://localhost:3000/login"); // 예시: 로그인 페이지로 리다이렉트
            }
        } else {
            // OAuth2User가 null인 경우 (로그인 실패)
            return new RedirectView("http://localhost:3000/login"); // 예시: 로그인 페이지로 리다이렉트
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