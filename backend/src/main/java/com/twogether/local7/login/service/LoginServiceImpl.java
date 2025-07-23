package com.twogether.local7.login.service;

import com.twogether.local7.login.dao.LoginDAO;
import com.twogether.local7.login.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;
import java.sql.Timestamp;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private LoginDAO loginDAO;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

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

    @Override
    public LoginVO processOAuthUser(String email, String name, String picture, String oauthProviderId, String registrationId) {
        LoginVO user = null;
        // OAuth 공급자 ID와 등록 ID를 조합하여 고유한 userLoginId 생성
        String userLoginId = registrationId + "_" + oauthProviderId;

        // 1. userLoginId를 기준으로 사용자 존재 여부 확인
        user = loginDAO.findByUserLoginId(userLoginId);

        // 2. userLoginId로 찾지 못했고, 이메일이 있다면 이메일로 다시 사용자 존재 여부 확인
        // 이는 일반 회원가입된 사용자가 OAuth로 처음 로그인할 경우를 대비
        if (user == null && email != null && !email.isEmpty()) {
            user = loginDAO.findByUserEmail(email);
            if (user != null) {
                // 이메일로 사용자를 찾았으나, OAuth userLoginId가 없는 경우
                // 기존 사용자의 userLoginId를 OAuth 정보로 업데이트
                user.setUserLoginId(userLoginId);
                // OAuth로 로그인했으므로 비밀번호를 OAuth 전용 값으로 변경 (필요시)
                user.setUserPassword("NO_PASSWORD_OAUTH");
                loginDAO.updateOAuthUser(user);
                System.out.println("Existing email user linked to OAuth: " + email);
            }
        }

        if (user == null) {
            // 신규 사용자
            user = new LoginVO();
            user.setUserLoginId(userLoginId); // 고유한 OAuth 로그인 ID 설정
            user.setUserEmail(email); // 이메일은 null일 수 있음
            user.setUserName(name);
            user.setUserProfileImageUrl(picture);
            user.setRuleId(2L); // 예시: 일반 사용자 권한
            user.setCreateDate(new Timestamp(System.currentTimeMillis()));
            user.setCreatedId("SYSTEM_OAUTH");
            user.setUserPassword(null); // OAuth 사용자는 비밀번호 없음
            user.setUserNickname(name != null ? name : registrationId + "_User");
            user.setUserBio("Self-introduction not provided.");

            loginDAO.insertOAuthUser(user); // 새로운 OAuth 사용자 삽입
            System.out.println("New OAuth user registered: " + userLoginId);
        } else {
            // 기존 사용자 (정보 업데이트)
            user.setUserName(name);
            user.setUserProfileImageUrl(picture);
            user.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
            user.setUpdatedId("SYSTEM_OAUTH");
            loginDAO.updateOAuthUser(user); // 기존 OAuth 사용자 정보 업데이트
            System.out.println("Existing OAuth user updated: " + userLoginId);
        }
        return user;
    }
}