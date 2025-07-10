package com.twogether.local7.user.service;

import com.twogether.local7.user.vo.UserVO;

public interface UserService {
    // Returns the UserVO if login is successful, null otherwise
    UserVO login(String credential, String password);
    //새로운 메서드추가
    boolean checkLoginIdDuplicate(String userLoginId);
    //새로운 메서드추가
    void updateUserLoginId(Long userId, String newUserLoginId);
    //새로운 메서드추가
    void requestPasswordChange(Long userId, String currentPassword);
    //새로운 메서드추가
    void resetPassword(Long userId, String verificationCode, String newPassword);
    //새로운 메서드추가: 닉네임 중복 확인
    boolean checkNicknameDuplicate(String userNickname);
    //새로운 메서드추가: 닉네임 변경
    void updateUserNickname(Long userId, String newUserNickname);
}