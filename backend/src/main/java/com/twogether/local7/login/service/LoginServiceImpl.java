package com.twogether.local7.login.service;

import com.twogether.local7.login.dao.LoginDAO;
import com.twogether.local7.login.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;
import java.sql.Timestamp; // Timestamp import 추가

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

        if (user == null) {
            throw new RuntimeException("아이디 또는 이메일을 찾을 수 없습니다.");
        }

        if (!user.getUserPassword().equals(password)) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    // 새롭게 추가된 부분
    @Override
    public LoginVO processOAuthUser(String email, String name, String picture) {
        LoginVO user = loginDAO.findByUserEmail(email); // 이메일로 사용자 조회

        if (user == null) {
            // 신규 사용자인 경우
            user = new LoginVO();
            user.setUserEmail(email);
            user.setUserName(name);
            user.setUserLoginId(email); // OAuth 사용자의 userLoginId는 이메일로 설정
            user.setUserProfileImageUrl(picture);
            user.setRuleId(2L); // 예시: 일반 사용자 권한 (필요에 따라 변경)
            user.setCreateDate(new Timestamp(System.currentTimeMillis())); // 현재 시간으로 생성 시간 설정
            user.setCreatedId("SYSTEM_OAUTH"); // 생성자 ID 설정 (예: SYSTEM_OAUTH)
            // 비밀번호는 소셜 로그인 사용자의 경우 필요 없지만, DB 필드가 NOT NULL이면 "N/A" 등으로 설정하거나,
            // Spring Security UserDetails 구현체에서 `getPassword()`가 null이 아니도록 처리해야 합니다.
            // 여기서는 임시로 null로 두지만, 실제 DB 스키마에 따라 조정 필요
            user.setUserPassword(null); // OAuth 사용자는 비밀번호 없음

            loginDAO.insertOAuthUser(user); // 새로운 OAuth 사용자 삽입
            System.out.println("New Google user registered: " + email);
        } else {
            // 기존 사용자인 경우 (정보 업데이트)
            user.setUserName(name);
            user.setUserProfileImageUrl(picture);
            user.setUpdatedDate(new Timestamp(System.currentTimeMillis())); // 현재 시간으로 업데이트 시간 설정
            user.setUpdatedId("SYSTEM_OAUTH"); // 업데이트자 ID 설정 (예: SYSTEM_OAUTH)
            loginDAO.updateOAuthUser(user); // 기존 OAuth 사용자 정보 업데이트
            System.out.println("Existing Google user updated: " + email);
        }
        return user;
    }
}