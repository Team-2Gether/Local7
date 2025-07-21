package com.twogether.local7.login.service;

import com.twogether.local7.login.vo.LoginVO;

public interface LoginService {
    LoginVO login(String credential, String password);
    // 새롭게 추가된 부분
    LoginVO processOAuthUser(String email, String name, String picture);
}