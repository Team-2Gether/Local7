package com.twogether.local7.user.controller;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.user.service.UserService;
import com.twogether.local7.user.vo.PostDetailVO;
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

    @PatchMapping("/update-loginid")
    public ResponseEntity<Map<String, Object>> updateLoginId(@RequestParam Long userId, @RequestParam String newUserLoginId) {
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.updateUserLoginId(userId, newUserLoginId);
            return ResponseEntity.ok(createSuccessResponse("로그인 아이디가 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("update_failed", "로그인 아이디 변경 중 오류가 발생했습니다."));
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

    @PatchMapping("/update-nickname")
    public ResponseEntity<Map<String, Object>> updateNickname(@RequestParam Long userId, @RequestParam String newUserNickname) {
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
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
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.requestWithdrawalVerification(userId);
            return ResponseEntity.ok(createSuccessResponse("회원 탈퇴를 위한 인증 코드가 이메일로 발송되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("withdrawal_request_failed", "회원 탈퇴 인증 코드 발송 중 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdrawUser(
            @RequestParam Long userId,
            @RequestParam String password,
            @RequestParam String verificationCode,
            HttpSession session) {
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.deleteUser(userId, password, verificationCode);
            session.invalidate(); // 세션 무효화
            return ResponseEntity.ok(createSuccessResponse("회원 탈퇴가 성공적으로 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("validation_error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("withdrawal_failed", "회원 탈퇴 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<Map<String, Object>> getUserPosts( // 반환 타입을 Map으로 변경
                                                             @PathVariable("userId") Long userId,
                                                             @RequestParam(defaultValue = "1") int page,
                                                             @RequestParam(defaultValue = "10") int pageSize) {
        SimplePageable pageable = new SimplePageable(page, pageSize);
        Pagination<PostDetailVO> posts = userService.getPostsByUserId(userId, pageable);

        Map<String, Object> response = new HashMap<>(); // 응답 Map 생성
        response.put("status", "success"); // status 필드 추가
        response.put("pagination", posts); // pagination 필드에 PostDetailVO 리스트 할당
        return ResponseEntity.ok(response); // 수정된 Map 반환
    }

    @GetMapping("/{userId}/posts/count")
    public ResponseEntity<Map<String, Object>> getUserPostCount(@PathVariable("userId") Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            int postCount = userService.countPostsByUserId(userId);
            response.put("status", "success");
            response.put("postCount", postCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("count_failed", "게시글 수 조회 중 오류가 발생했습니다."));
        }
    }

    // 로그인 ID로 사용자 프로필 조회 엔드포인트
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

    // 닉네임으로 사용자 프로필 조회 엔드포인트
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

    // 게시글 ID로 단일 게시글 조회 엔드포인트 추가
    @GetMapping("/posts/{postId}")
    public ResponseEntity<Map<String, Object>> getPostDetailById(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();
        try {
            PostDetailVO post = userService.getPostById(postId);
            if (post != null) {
                response.put("status", "success");
                response.put("message", "게시글을 성공적으로 조회했습니다.");
                response.put("post", post);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("post_not_found", "해당 게시글을 찾을 수 없습니다."));
            }
        } catch (Exception e) {
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