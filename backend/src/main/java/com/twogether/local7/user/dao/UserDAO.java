package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserLoginId(String userLoginId);
    UserVO findByUserEmail(String userEmail);
    // 새로운 메서드 추가: userId로 사용자 조회
    UserVO findByUserId(Long userId); // 이 메서드를 추가합니다.
    //새로운 메서드추가
    int countByUserLoginId(String userLoginId);
    //새로운 메서드추가
    void updateUserLoginId(Long userId, String newUserLoginId);
    //새로운 메서드추가
    void updateUserPassword(Long userId, String newPassword);
    //새로운 메서드추가: 닉네임 중복 확인
    int countByUserNickname(String userNickname);
    //새로운 메서드추가: 닉네임 변경
    void updateUserNickname(Long userId, String newUserNickname);
}