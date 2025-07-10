package com.twogether.local7.user.service;

import com.twogether.local7.user.vo.UserVO;

public interface UserService {
    UserVO login(String credential, String password);
    boolean checkLoginIdDuplicate(String userLoginId);
    void updateUserLoginId(Long userId, String newUserLoginId);
    void requestPasswordChange(Long userId, String currentPassword);
    void resetPassword(Long userId, String verificationCode, String newPassword);
    boolean checkNicknameDuplicate(String userNickname);
    void updateUserNickname(Long userId, String newUserNickname);
    void requestWithdrawalVerification(Long userId); // 회원 탈퇴 인증 코드 요청 메서드 추가
    void deleteUser(Long userId, String password, String verificationCode); // 회원 탈퇴 메서드에 인증 코드 추가
}