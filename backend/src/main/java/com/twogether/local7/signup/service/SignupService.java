package com.twogether.local7.signup.service;

import com.twogether.local7.signup.vo.SignupVO;
import reactor.core.publisher.Mono;

public interface SignupService {
    Mono<Void> registerUser(SignupVO signupVO);
    Mono<String> sendVerificationEmail(String email);
    Mono<Boolean> verifyEmailCode(String email, String code);
    Mono<Boolean> isLoginIdDuplicate(String userLoginId);
    Mono<Boolean> isEmailDuplicate(String userEmail);
    Mono<Boolean> isNicknameDuplicate(String userNickname);
}