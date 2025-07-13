package com.twogether.local7.login.service;

import com.twogether.local7.login.dao.LoginDAO;
import com.twogether.local7.login.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private LoginDAO loginDAO;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    public LoginVO login(String credential, String password) {
        LoginVO user = null;
        if (EMAIL_PATTERN.matcher(credential).matches()) {
            user = loginDAO.findByUserEmail(credential);
        } else {
            user = loginDAO.findByUserLoginId(credential);
        }

        if (!isValidUser(user)) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
        }

        if (!user.getUserPassword().equals(password)) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    private boolean isValidUser(LoginVO user) {
        return user != null;
    }
}