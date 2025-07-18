package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
import com.twogether.local7.pagintion.Pageable;

public interface UserService {
    // UserVO login(String credential, String password); // LoginService로 이동
    boolean checkLoginIdDuplicate(String userLoginId);

    void updateUserLoginId(Long userId, String newUserLoginId);

    boolean checkNicknameDuplicate(String userNickname);

    void updateUserNickname(Long userId, String newUserNickname);
    void requestWithdrawalVerification(Long userId);

    void deleteUser(Long userId, String password, String verificationCode);

    Pagination<PostDetailVO> getPostsByUserId(Long userId, Pageable pageable); // PostDetailVO로 변경
    int countPostsByUserId(Long userId);

    // 로그인 ID로 사용자 프로필 조회
    UserVO getUserProfileByLoginId(String userLoginId);

    // 닉네임으로 사용자 프로필 조회
    UserVO getUserProfileByNickname(String userNickname);

    // 게시글 ID로 단일 게시글 조회 추가
    PostDetailVO getPostById(Long postId);

    // 새로운 메서드 추가: 비밀번호 변경
    void updateUserPassword(Long userId, String newPassword); //

    // 새로운 메서드 추가: 현재 비밀번호 확인
    boolean checkUserPassword(Long userId, String currentPassword); //

    // 새로운 메서드 추가: 사용자 프로필 이미지 업데이트
    void updateUserProfileImage(Long userId, String userProfileImageUrl);
}