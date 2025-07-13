package com.twogether.local7.user.controller;

import com.twogether.local7.pagention.Pagination;
import com.twogether.local7.pagention.SimplePageable;
import com.twogether.local7.user.service.UserService;
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

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request, HttpSession session) {
        String currentPassword = request.get("currentPassword"); // 현재 비밀번호 필드 추가
        String newPassword = request.get("newPassword");
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        }
        if (currentPassword == null || currentPassword.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_input", "현재 비밀번호와 새 비밀번호를 모두 입력해주세요."));
        }

        try {
            // Service Layer에서 현재 비밀번호 검증이 필요하다면 UserVO를 조회하여 비교
            // 여기서는 UserVO에서 비밀번호를 직접 가져오는 대신, UserService 내에서 처리하도록 위임
            userService.resetPassword(userId, newPassword);
            return ResponseEntity.ok(createSuccessResponse("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해야 합니다."));
        } catch (RuntimeException e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = "비밀번호 재설정 중 오류가 발생했습니다.";
            // RuntimeException 메시지에 따라 구체적인 에러 처리 (예: "현재 비밀번호가 일치하지 않습니다." 메시지를 던졌을 경우)
            if (e.getMessage() != null && e.getMessage().contains("현재 비밀번호가 일치하지 않습니다.")) {
                status = HttpStatus.UNAUTHORIZED;
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
            session.invalidate();
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
            SimplePageable pageable = new SimplePageable(page, size);
            Pagination<PostVO> userPosts = userService.getPostsByUserId(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "사용자가 작성한 게시글 목록을 성공적으로 조회했습니다.");
            response.put("pagination", userPosts);
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