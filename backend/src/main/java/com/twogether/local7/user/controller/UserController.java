package com.twogether.local7.user.controller;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.pagintion.SimplePageable;
import com.twogether.local7.user.dto.UserProfileImageUpdateRequest;
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

    // 기존 update-loginid 엔드포인트를 인증코드 발송 요청으로 변경합니다.
    @PostMapping("/request-loginid-change-verification")
    public ResponseEntity<Map<String, Object>> requestLoginIdChangeVerification(@RequestParam Long userId, @RequestParam String newUserLoginId) {
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.requestLoginIdChangeVerification(userId, newUserLoginId);
            return ResponseEntity.ok(createSuccessResponse("아이디 변경을 위한 인증 코드가 이메일로 발송되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("validation_error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("verification_request_failed", "아이디 변경 인증 코드 발송 중 오류가 발생했습니다."));
        }
    }

    // 새로운 엔드포인트: 인증 코드를 통한 아이디 변경 최종 확정
    @PostMapping("/confirm-loginid-change")
    public ResponseEntity<Map<String, Object>> confirmLoginIdChange(
            @RequestParam Long userId,
            @RequestParam String newUserLoginId,
            @RequestParam String verificationCode) {
        try {
            userService.confirmUserLoginIdChange(userId, newUserLoginId, verificationCode);
            return ResponseEntity.ok(createSuccessResponse("로그인 아이디가 성공적으로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("validation_error", e.getMessage()));
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
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("check_failed", "닉네임 중복 확인 중 오류가 발생했습니다."));
        }
    }

    // @PatchMapping 대신 @PostMapping 사용 (저장된 정보에 따름)
    @PostMapping("/update-nickname")
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

    // @DeleteMapping 대신 @PostMapping 사용 (저장된 정보에 따름)
    @PostMapping("/withdraw")
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
    public ResponseEntity<Map<String, Object>> getPostDetailById(@PathVariable Long postId, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        Long currentUserId = (Long) session.getAttribute("userId");

        try {
            PostDetailVO post = userService.getPostById(postId, currentUserId);
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

    // 새로운 엔드포인트: 비밀번호 변경
    //
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestParam Long userId,
            @RequestParam String currentPassword, // 현재 비밀번호도 받도록 추가 (백엔드 로직에서 사용)
            @RequestParam String newPassword) {
        try {
            // 현재 비밀번호 확인 로직 (UserService에서 처리)
            boolean isPasswordCorrect = userService.checkUserPassword(userId, currentPassword);
            if (!isPasswordCorrect) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
                        .body(createErrorResponse("invalid_current_password", "현재 비밀번호가 올바르지 않습니다."));
            }

            // 비밀번호 변경 로직
            userService.updateUserPassword(userId, newPassword);
            return ResponseEntity.ok(createSuccessResponse("비밀번호가 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("password_change_failed", "비밀번호 변경 중 오류가 발생했습니다."));
        }
    }

    // 새로운 엔드포인트: 현재 비밀번호 확인
    @PostMapping("/check-password")
    public ResponseEntity<Map<String, Object>> checkPassword(
            @RequestParam Long userId,
            @RequestParam String password) {
        try {
            // 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 (보안 강화)

            boolean isPasswordCorrect = userService.checkUserPassword(userId, password);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("isPasswordCorrect", isPasswordCorrect);
            response.put("message", isPasswordCorrect ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("password_check_failed", "비밀번호 확인 중 오류가 발생했습니다."));
        }
    }

    // 새로운 엔드포인트: 프로필 이미지 업데이트
    @PostMapping("/update-profile-image")
    public ResponseEntity<Map<String, Object>> updateUserProfileImage(
            @RequestBody UserProfileImageUpdateRequest request) { // @RequestBody로 변경
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.updateUserProfileImage(request.getUserId(), request.getUserProfileImageUrl());
            return ResponseEntity.ok(createSuccessResponse("프로필 이미지가 성공적으로 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("profile_image_update_failed", "프로필 이미지 변경 중 오류가 발생했습니다."));
        }
    }

    // 새롭게 추가된 부분: 자기소개 업데이트 엔드포인트
    @PostMapping("/update-bio")
    public ResponseEntity<Map<String, Object>> updateUserBio(
            @RequestParam Long userId,
            @RequestParam String userBio) {
        try {
            // 여기에 현재 로그인된 사용자가 userId와 일치하는지 확인하는 로직 추가 필요 (보안 강화)
            userService.updateUserBio(userId, userBio);
            return ResponseEntity.ok(createSuccessResponse("자기소개가 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("bio_update_failed", "자기소개 업데이트 중 오류가 발생했습니다."));
        }
    }

    // 투표 여부 및 투표 지역 업데이트 엔드포인트 추가
    @PostMapping("/update-vote-status") //
    public ResponseEntity<Map<String, Object>> updateVotedStatus( //
                                                                  @RequestParam Long userId, //
                                                                  @RequestParam String hasVoted, //
                                                                  @RequestParam(required = false) Integer votedRegion) { //
        try { //
            userService.updateVotedStatus(userId, hasVoted, votedRegion); //
            return ResponseEntity.ok(createSuccessResponse("투표 상태 및 지역이 성공적으로 업데이트되었습니다.")); //
        } catch (Exception e) { //
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) //
                    .body(createErrorResponse("vote_status_update_failed", "투표 상태 및 지역 업데이트 중 오류가 발생했습니다.")); //
        } //
    } //

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