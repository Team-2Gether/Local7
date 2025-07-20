// src/main/java/com/twogether/local7/user/service/UserForgetService.java
package com.twogether.local7.user.service;

// 새로운 서비스 인터페이스 정의
public interface UserForgetService {
    /**
     * 이메일 주소로 인증 코드를 전송합니다.
     *
     * @param email 인증 코드를 받을 이메일 주소
     * @return 성공 여부 (true: 성공, false: 실패 또는 이메일 미등록)
     */
    boolean sendAuthCodeToEmail(String email);

    /**
     * 이메일과 인증 코드를 확인합니다.
     *
     * @param email 사용자 이메일
     * @param authCode 사용자가 입력한 인증 코드
     * @return 인증 성공 시 해당 이메일의 로그인 ID, 실패 시 null
     */
    String verifyAuthCode(String email, String authCode);

    /**
     * 이메일과 인증 코드를 확인하고 비밀번호를 재설정합니다.
     *
     * @param email 사용자 이메일
     * @param authCode 사용자가 입력한 인증 코드
     * @param newPassword 새로운 비밀번호
     * @return 비밀번호 재설정 성공 여부
     */
    boolean resetPassword(String email, String authCode, String newPassword);
}