package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserLoginId(String userLoginId);
    UserVO findByUserEmail(String userEmail);
    //새로운 메서드추가
    int countByUserLoginId(String userLoginId);
    //새로운 메서드추가
    void updateUserLoginId(Long userId, String newUserLoginId);
    //새로운 메서드추가
    void updateUserPassword(Long userId, String newPassword);
}