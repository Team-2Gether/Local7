package com.twogether.local7.user.controller;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.user.service.UserService;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.user.vo.UserVO; // UserVO import 추가
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
    public ResponseEntity<Map<String, Object>> updateUserLoginId(@RequestParam Long userId, @RequestParam String newUserLoginId) {
        try {
            userService.updateUserLoginId(userId, newUserLoginId);
            return ResponseEntity.ok(createSuccessResponse("아이디가 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("update_failed", "아이디 변경 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestParam Long userId, @RequestParam String newPassword) {
        try {
            userService.resetPassword(userId, newPassword);
            return ResponseEntity.ok(createSuccessResponse("비밀번호가 성공적으로 재설정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("reset_failed", "비밀번호 재설정 중 오류가 발생했습니다."));
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
    public ResponseEntity<Map<String, Object>> updateUserNickname(@RequestParam Long userId, @RequestParam String newUserNickname) {
        try {
            userService.updateUserNickname(userId, newUserNickname);
            return ResponseEntity.ok(createSuccessResponse("닉네임이 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("update_failed", "닉네임 변경 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/request-withdrawal")
    public ResponseEntity<Map<String, Object>> requestWithdrawalVerification(@RequestParam Long userId) {
        try {
            userService.requestWithdrawalVerification(userId);
            return ResponseEntity.ok(createSuccessResponse("탈퇴 인증 코드가 이메일로 발송되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_request", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("email_send_failed", "인증 이메일 발송 중 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @RequestParam Long userId,
            @RequestParam String password,
            @RequestParam String verificationCode
    ) {
        try {
            userService.deleteUser(userId, password, verificationCode);
            return ResponseEntity.ok(createSuccessResponse("회원 탈퇴가 성공적으로 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("invalid_credentials", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("verification_failed", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("delete_failed", "회원 탈퇴 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<Map<String, Object>> getPostsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session // 세션 정보를 받아 사용자 인증에 활용 가능
    ) {
        // 실제 애플리케이션에서는 세션 또는 JWT 토큰 등을 통해 사용자 인증 및 권한 확인 로직 추가 필요
        // 예시: Long loggedInUserId = (Long) session.getAttribute("loggedInUserId");
        // if (loggedInUserId == null) {
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        //             .body(createErrorResponse("unauthorized", "로그인 후 이용해주세요."));
        // }

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

    // 새로운 기능 추가: 로그인 ID로 사용자 프로필 조회
    @GetMapping("/profile/loginid/{userLoginId}")
    public ResponseEntity<Map<String, Object>> getUserProfileByLoginId(@PathVariable String userLoginId) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserVO userProfile = userService.getUserProfileByLoginId(userLoginId);
            if (userProfile != null) {
                response.put("status", "success");
                response.put("message", "사용자 프로필을 성공적으로 조회했습니다.");
                response.put("userProfile", userProfile);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("user_not_found", "해당 로그인 ID의 사용자를 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("profile_retrieval_failed", "사용자 프로필 조회 중 오류가 발생했습니다."));
        }
    }

    // 새로운 기능 추가: 닉네임으로 사용자 프로필 조회
    @GetMapping("/profile/nickname/{userNickname}")
    public ResponseEntity<Map<String, Object>> getUserProfileByNickname(@PathVariable String userNickname) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserVO userProfile = userService.getUserProfileByNickname(userNickname);
            if (userProfile != null) {
                response.put("status", "success");
                response.put("message", "사용자 프로필을 성공적으로 조회했습니다.");
                response.put("userProfile", userProfile);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("user_not_found", "해당 닉네임의 사용자를 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("profile_retrieval_failed", "사용자 프로필 조회 중 오류가 발생했습니다."));
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