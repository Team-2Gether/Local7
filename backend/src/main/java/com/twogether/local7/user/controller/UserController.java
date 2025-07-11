package com.twogether.local7.user.controller;

import com.twogether.local7.pagention.Pagination;
import com.twogether.local7.pagention.SimplePageable;
import com.twogether.local7.user.service.UserService;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
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
        Long userId = (Long) session.getAttribute("userId");

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
            session.setAttribute("userLoginId", newUserLoginId);
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
            return ResponseEntity.ok(createSuccessResponse("비밀번호 재설정을 위한 인증 코드를 이메일로 발송했습니다."));
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "비밀번호 변경 요청 중 오류가 발생했습니다.";
            if (e.getMessage() != null && e.getMessage().contains("현재 비밀번호가 일치하지 않습니다.")) {
                status = HttpStatus.UNAUTHORIZED;
                message = e.getMessage();
            }
            return ResponseEntity.status(status).body(createErrorResponse("request_failed", message));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request, HttpSession session) {
        String verificationCode = request.get("verificationCode");
        String newPassword = request.get("newPassword");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }
        if (verificationCode == null || verificationCode.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "인증 코드와 새 비밀번호를 모두 입력해주세요."));
        }

        try {
            userService.resetPassword(userId, verificationCode, newPassword);
            return ResponseEntity.ok(createSuccessResponse("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해야 합니다."));
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "비밀번호 재설정 중 오류가 발생했습니다.";
            if (e.getMessage() != null && e.getMessage().contains("인증코드가 유효하지 않거나 만료되었습니다.")) {
                status = HttpStatus.BAD_REQUEST;
                message = e.getMessage();
            }
            return ResponseEntity.status(status).body(createErrorResponse("reset_failed", message));
        }
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, ?>> checkNicknameDuplicate(@RequestParam String userNickname) {
        try {
            boolean isDuplicate = userService.checkNicknameDuplicate(userNickname);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("isDuplicate", isDuplicate);
            response.put("message", isDuplicate ? "이미 사용중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("check_failed", "닉네임 중복 확인 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/update-nickname")
    public ResponseEntity<Map<String, Object>> updateNickname(@RequestBody Map<String, String> request, HttpSession session) {
        String newUserNickname = request.get("newUserNickname");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }

        if (newUserNickname == null || newUserNickname.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "새 닉네임을 입력해주세요."));
        }

        try {
            userService.updateUserNickname(userId, newUserNickname);
            session.setAttribute("userNickname", newUserNickname);
            return ResponseEntity.ok(createSuccessResponse("닉네임이 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("update_failed", "닉네임 변경 중 오류가 발생했습니다."));
        }
    }

    // 회원 탈퇴 인증 코드 요청 API
    @PostMapping("/request-withdrawal-verification")
    public ResponseEntity<Map<String, Object>> requestWithdrawalVerification(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }

        try {
            userService.requestWithdrawalVerification(userId);
            return ResponseEntity.ok(createSuccessResponse("회원 탈퇴를 위한 인증 코드를 이메일로 발송했습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("withdrawal_request_failed", "회원 탈퇴 인증 코드 발송 중 오류가 발생했습니다."));
        }
    }

    // 회원 탈퇴 API
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdraw(@RequestBody Map<String, String> request, HttpSession session) {
        String password = request.get("password");
        String verificationCode = request.get("verificationCode");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }
        if (password == null || password.isEmpty() || verificationCode == null || verificationCode.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "비밀번호와 인증 코드를 모두 입력해주세요."));
        }

        try {
            userService.deleteUser(userId, password, verificationCode);
            session.invalidate(); // 회원 탈퇴 성공 시 세션 무효화
            return ResponseEntity.ok(createSuccessResponse("회원 탈퇴가 성공적으로 처리되었습니다."));
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "회원 탈퇴 처리 중 오류가 발생했습니다.";
            if (e.getMessage() != null) {
                if (e.getMessage().contains("비밀번호가 일치하지 않아 회원 탈퇴를 진행할 수 없습니다.")) {
                    status = HttpStatus.UNAUTHORIZED;
                } else if (e.getMessage().contains("인증코드가 유효하지 않거나 만료되었습니다.")) {
                    status = HttpStatus.BAD_REQUEST;
                }
                message = e.getMessage();
            }
            return ResponseEntity.status(status).body(createErrorResponse("withdrawal_failed", message));
        }
    }

    // 수정된 게시글 조회 API
    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getUserPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }

        try {
            // SimplePageable 객체 생성
            SimplePageable pageable = new SimplePageable(page, size);
            Pagination<PostVO> userPosts = userService.getPostsByUserId(userId, pageable); // Pageable 파라미터 전달

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "사용자가 작성한 게시글 목록을 성공적으로 조회했습니다.");
            response.put("pagination", userPosts); // Pagination 객체 전체를 반환
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_pagination_parameters", e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("post_retrieval_failed", "게시글 조회 중 오류가 발생했습니다."));
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