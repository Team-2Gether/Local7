package com.twogether.local7.login.dao;

import com.twogether.local7.login.vo.LoginVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface LoginDAO {
    LoginVO findByUserLoginId(String userLoginId);

    LoginVO findByUserEmail(String userEmail);

    // 새롭게 추가된 부분
    void insertOAuthUser(LoginVO user); // OAuth 사용자 삽입
    void updateOAuthUser(LoginVO user); // OAuth 사용자 업데이트 (기존 사용자 정보 갱신)
}