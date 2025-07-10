package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserLoginId(String userLoginId);

    UserVO findByUserEmail(String userEmail);
    // userId로 사용자 조회
    UserVO findByUserId(Long userId); // 이 메서드를 추가합니다.
    
    int countByUserLoginId(String userLoginId);
    
    void updateUserLoginId(Long userId, String newUserLoginId);
    
    void updateUserPassword(Long userId, String newPassword);
    // 닉네임 중복 확인
    int countByUserNickname(String userNickname);
    // 닉네임 변경
    void updateUserNickname(Long userId, String newUserNickname);
    // 회원 탈퇴 (사용자 삭제)
    void deleteUser(Long userId);
}