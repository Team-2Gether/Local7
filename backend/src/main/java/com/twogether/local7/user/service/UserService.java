package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.pagintion.Pageable;

public interface UserService {
    // UserVO login(String credential, String password); // LoginService로 이동
    boolean checkLoginIdDuplicate(String userLoginId);

    void updateUserLoginId(Long userId, String newUserLoginId);

    boolean checkNicknameDuplicate(String userNickname);

    void updateUserNickname(Long userId, String newUserNickname);
    void requestWithdrawalVerification(Long userId);

    void deleteUser(Long userId, String password, String verificationCode);

    Pagination<PostVO> getPostsByUserId(Long userId, Pageable pageable);
    int countPostsByUserId(Long userId);

    // 로그인 ID로 사용자 프로필 조회
    UserVO getUserProfileByLoginId(String userLoginId);

    // 닉네임으로 사용자 프로필 조회
    UserVO getUserProfileByNickname(String userNickname);

    // 게시글 ID로 단일 게시글 조회 추가
    PostVO getPostById(Long postId);
}