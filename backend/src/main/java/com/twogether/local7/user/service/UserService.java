// src/main/java/com/twogether/local7/user/service/UserService.java
package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
import com.twogether.local7.pagintion.Pageable;

public interface UserService {
    boolean checkLoginIdDuplicate(String userLoginId);

    // 기존 updateUserLoginId 대신 새로운 2단계 인증 방식 메서드 추가
    void requestLoginIdChangeVerification(Long userId, String newUserLoginId);

    void confirmUserLoginIdChange(Long userId, String newUserLoginId, String verificationCode);

    boolean checkNicknameDuplicate(String userNickname);

    void updateUserNickname(Long userId, String newUserNickname);

    void requestWithdrawalVerification(Long userId);

    void deleteUser(Long userId, String password, String verificationCode);

    Pagination<PostDetailVO> getPostsByUserId(Long userId, Pageable pageable);
    int countPostsByUserId(Long userId);

    UserVO getUserProfileByLoginId(String userLoginId);

    UserVO getUserProfileByNickname(String userNickname);

    PostDetailVO getPostById(Long postId, Long currentUserId);

    void updateUserPassword(Long userId, String newPassword);

    boolean checkUserPassword(Long userId, String currentPassword);

    void updateUserProfileImage(Long userId, String userProfileImageUrl);

    // 새롭게 추가된 부분
    void updateUserBio(Long userId, String userBio);

    // 투표 여부 및 투표 지역 업데이트
    void updateVotedStatus(Long userId, String hasVoted, Integer votedRegion); //
}