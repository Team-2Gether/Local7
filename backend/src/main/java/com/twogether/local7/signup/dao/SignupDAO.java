package com.twogether.local7.signup.dao;

import com.twogether.local7.signup.vo.SignupVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface SignupDAO {
    void insertUser(SignupVO signupVO);
    int countByUserLoginId(String userLoginId);
    int countByUserEmail(String userEmail);
    int countByUserNickname(String userNickname);
}