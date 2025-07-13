package com.twogether.local7.login.service;

import com.twogether.local7.login.vo.LoginVO;

public interface LoginService {
    LoginVO login(String credential, String password);
}