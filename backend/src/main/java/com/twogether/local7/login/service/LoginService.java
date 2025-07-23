package com.twogether.local7.login.service;

import com.twogether.local7.login.vo.LoginVO;

public interface LoginService {
    LoginVO login(String credential, String password);
    // 새롭게 추가된 부분 - email 파라미터를 null 허용하도록 변경
    LoginVO processOAuthUser(String email, String name, String picture);
}