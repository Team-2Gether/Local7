package com.twogether.local7.user.service;

import com.twogether.local7.pagention.Pagination;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.pagention.Pageable;

public interface UserService {
    // UserVO login(String credential, String password); // LoginService로 이동
    boolean checkLoginIdDuplicate(String userLoginId);
    void updateUserLoginId(Long userId, String newUserLoginId);
    void requestPasswordChange(Long userId, String currentPassword);
    void resetPassword(Long userId, String verificationCode, String newPassword);
    boolean checkNicknameDuplicate(String userNickname);
    void updateUserNickname(Long userId, String newUserNickname);
    void requestWithdrawalVerification(Long userId);
    void deleteUser(Long userId, String password, String verificationCode);

    Pagination<PostVO> getPostsByUserId(Long userId, Pageable pageable);
    int countPostsByUserId(Long userId);
}