package com.twogether.local7.user.controller;

import com.twogether.local7.user.service.UserService;
import com.twogether.local7.user.vo.UserVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<? extends Map<String,? extends Object>> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String credential = loginRequest.get("credential");
        String password = loginRequest.get("password");

        if (credential == null || credential.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "아이디/이메일과 비밀번호를 모두 입력해주세요."));
        }

        try {
            UserVO user = userService.login(credential, password);

            // 로그인 성공: 세션에 사용자 정보 및 권한 정보 저장
            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userLoginId", user.getUserLoginId());
            session.setAttribute("userUsername", user.getUserUsername());
            session.setAttribute("userNickname", user.getUserNickname());
            session.setAttribute("userRule", user.getRuleName()); // 권한 이름 저장
            session.setAttribute("userEmail",user.getUserEmail());

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("status", "success");
            successResponse.put("message", "로그인 성공!");
            successResponse.put("user", user); // UserVO (password removed, ruleName included)
            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            System.err.println("Login error: " + e.getMessage());
            // 특정 예외 유형에 따라 다른 에러 코드 반환
            if (e.getMessage() != null) {
                if (e.getMessage().contains("User not found")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(createErrorResponse("user_not_found", "존재하지 않는 아이디/이메일입니다."));
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
        session.invalidate(); // 현재 세션 무효화
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
            response.put("userUsername", session.getAttribute("userUsername"));
            response.put("userNickname", session.getAttribute("userNickname"));
            response.put("userRule", session.getAttribute("userRule")); // 세션에서 권한 이름 반환
            response.put("userEmail",session.getAttribute("userEmail"));
            return ResponseEntity.ok(response);
        } else {
            response.put("isLoggedIn", false);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/check-loginid")
    public ResponseEntity<Map<String, ?>> checkLoginIdDuplicate(@RequestParam String userLoginId) {
        try {
            boolean isDuplicate = userService.checkLoginIdDuplicate(userLoginId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("isDuplicate", isDuplicate);
            response.put("message", isDuplicate ? "이미 사용중인 아이디입니다." : "사용 가능한 아이디입니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("check_failed", "아이디 중복 확인 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/update-loginid")
    public ResponseEntity<Map<String, Object>> updateLoginId(@RequestBody Map<String, String> request, HttpSession session) {
        String newUserLoginId = request.get("newUserLoginId");
        Long userId = (Long) session.getAttribute("userId"); // 세션에서 사용자 ID 가져오기

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }

        if (newUserLoginId == null || newUserLoginId.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "새 아이디를 입력해주세요."));
        }

        try {
            userService.updateUserLoginId(userId, newUserLoginId);
            return ResponseEntity.ok(createSuccessResponse("아이디가 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("update_failed", "아이디 변경 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/request-password-change")
    public ResponseEntity<Map<String, Object>> requestPasswordChange(@RequestBody Map<String, String> request, HttpSession session) {
        String currentPassword = request.get("currentPassword");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }
        if (currentPassword == null || currentPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "현재 비밀번호를 입력해주세요."));
        }

        try {
            userService.requestPasswordChange(userId, currentPassword);
            return ResponseEntity.ok(createSuccessResponse("인증 코드를 이메일로 발송했습니다.")); // Line 147
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "비밀번호 변경 요청 중 오류가 발생했습니다.";
            if (e.getMessage() != null && e.getMessage().contains("현재비밀번호가일치하지않습니다.")) {
                status = HttpStatus.UNAUTHORIZED;
                message = e.getMessage();
            }
            return ResponseEntity.status(status).body(createErrorResponse("request_failed", message));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request, HttpSession session) {
        String currentPassword = request.get("currentPassword");
        String verificationCode = request.get("verificationCode");
        String newPassword = request.get("newPassword");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }
        if (currentPassword == null || currentPassword.isEmpty() || verificationCode == null || verificationCode.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "모든 필드를 입력해주세요."));
        }

        try {
            userService.resetPassword(userId, verificationCode, newPassword);
            return ResponseEntity.ok(createSuccessResponse("비밀번호가 성공적으로 변경되었습니다."));
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "비밀번호 재설정 중 오류가 발생했습니다.";
            if (e.getMessage() != null && e.getMessage().contains("인증코드가유효하지않습니다.")) {
                status = HttpStatus.BAD_REQUEST;
                message = e.getMessage();
            }
            return ResponseEntity.status(status).body(createErrorResponse("reset_failed", message));
        }
    }

    private Map<String, Object> createErrorResponse(String code, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", code);
        response.put("message", message); // 클라이언트에서 메시지를 사용할 수 있도록 추가
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) { // Map<String, String>에서 Map<String, Object>로 변경
        Map<String, Object> response = new HashMap<>(); // HashMap<String, String>에서 HashMap<String, Object>로 변경
        response.put("status", "success");
        response.put("message", message);
        return response;
    }
}