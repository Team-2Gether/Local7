// UserService.java
package com.twogether.local7.user.service;

import com.twogether.local7.pagention.Pagination; // Pagination import 추가
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO; // PostVO import 추가
import com.twogether.local7.pagention.Pageable; // Custom Pageable import 추가

import java.util.List; // List import는 Pagination 사용으로 직접 반환하지 않으므로 제거

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

    // 수정된 메서드: Pagination을 반환하고 Pageable 파라미터 추가
    Pagination<PostVO> getPostsByUserId(Long userId, Pageable pageable);

    // 추가된 메서드: 특정 사용자의 총 게시글 수를 조회
    int countPostsByUserId(Long userId);
}