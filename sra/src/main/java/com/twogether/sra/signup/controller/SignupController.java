package com.twogether.sra.signup.controller;

import com.twogether.sra.signup.service.SignupService;
import com.twogether.sra.signup.vo.SignupVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/signup") // Changed mapping to reflect signup functionality
public class SignupController {

    @Autowired
    private SignupService signupService;

    // Handles user registration
    @PostMapping("/register")
    public Mono<ResponseEntity<?>> registerUser(@RequestBody SignupVO signupVO) {
        return signupService.isLoginIdDuplicate(signupVO.getUserLoginId())
                .flatMap(isDuplicate -> {
                    if (isDuplicate) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(createErrorResponse("duplicate_login_id", "이미 사용 중인 아이디입니다.")));
                    }
                    return signupService.isEmailDuplicate(signupVO.getUserEmail());
                })
                .flatMap(isDuplicate -> {
                    if ((boolean) isDuplicate) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(createErrorResponse("duplicate_email", "이미 사용 중인 이메일입니다.")));
                    }
                    return signupService.isNicknameDuplicate(signupVO.getUserNickname());
                })
                .flatMap(isDuplicate -> {
                    if ((boolean) isDuplicate) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(createErrorResponse("duplicate_nickname", "이미 사용 중인 닉네임입니다.")));
                    }
                    return signupService.registerUser(signupVO)
                            .thenReturn(ResponseEntity.ok(createSuccessResponse("회원가입이 성공적으로 완료되었습니다.")))
                            .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(createErrorResponse("registration_failed", "회원가입 중 오류가 발생했습니다: " + e.getMessage()))));
                });
    }

    // Sends an email verification code
    @PostMapping("/send-email-code")
    public Mono<ResponseEntity<?>> sendEmailCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(createErrorResponse("invalid_email", "이메일을 입력해주세요.")));
        }
        return signupService.isEmailDuplicate(email)
                .flatMap(isDuplicate -> {
                    if (isDuplicate) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(createErrorResponse("duplicate_email", "이미 가입된 이메일 주소입니다.")));
                    }
                    return signupService.sendVerificationEmail(email)
                            .thenReturn(ResponseEntity.ok(createSuccessResponse("인증 코드가 이메일로 전송되었습니다.")))
                            .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(createErrorResponse("email_send_failed", "이메일 전송 중 오류가 발생했습니다: " + e.getMessage()))));
                });
    }

    // Verifies the email code
    @PostMapping("/verify-email-code")
    public Mono<ResponseEntity<Map<String, String>>> verifyEmailCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(createErrorResponse("invalid_input", "이메일과 인증 코드를 모두 입력해주세요.")));
        }
        return signupService.verifyEmailCode(email, code)
                .map(isValid -> {
                    if (isValid) {
                        return ResponseEntity.ok(createSuccessResponse("이메일이 성공적으로 인증되었습니다."));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(createErrorResponse("invalid_code", "유효하지 않거나 만료된 인증 코드입니다."));
                    }
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("verification_failed", "인증 코드 확인 중 오류가 발생했습니다: " + e.getMessage()))));
    }

    // Checks for duplicate login ID
    @GetMapping("/check-duplicate/login-id/{loginId}")
    public Mono<ResponseEntity<?>> checkLoginIdDuplicate(@PathVariable String loginId) {
        return signupService.isLoginIdDuplicate(loginId)
                .map(isDuplicate -> {
                    Map<String, Boolean> response = new HashMap<>();
                    response.put("isDuplicate", isDuplicate);
                    return ResponseEntity.ok(response);
                });
    }

    // Checks for duplicate email
    @GetMapping("/check-duplicate/email/{email}")
    public Mono<ResponseEntity<?>> checkEmailDuplicate(@PathVariable String email) {
        return signupService.isEmailDuplicate(email)
                .map(isDuplicate -> {
                    Map<String, Boolean> response = new HashMap<>();
                    response.put("isDuplicate", isDuplicate);
                    return ResponseEntity.ok(response);
                });
    }

    // Checks for duplicate nickname
    @GetMapping("/check-duplicate/nickname/{nickname}")
    public Mono<ResponseEntity<?>> checkNicknameDuplicate(@PathVariable String nickname) {
        return signupService.isNicknameDuplicate(nickname)
                .map(isDuplicate -> {
                    Map<String, Boolean> response = new HashMap<>();
                    response.put("isDuplicate", isDuplicate);
                    return ResponseEntity.ok(response);
                });
    }

    // Helper method for consistent success response format
    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", message);
        return response;
    }

    // Helper method for consistent error response format
    private Map<String, String> createErrorResponse(String code, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", code);
        response.put("message", message);
        return response;
    }
}