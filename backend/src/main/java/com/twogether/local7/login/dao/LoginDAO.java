package com.twogether.local7.login.dao;

import com.twogether.local7.login.vo.LoginVO;
import org.apache.ibatis.annotations.Mapper; // @Mapper import 추가
import org.springframework.stereotype.Repository; // @Repository import 추가

@Mapper // MyBatis 매퍼 인터페이스로 지정
@Repository // Spring Data Access 계층 컴포넌트로 지정
public interface LoginDAO {
    LoginVO findByUserLoginId(String userLoginId);

    LoginVO findByUserEmail(String userEmail);
}