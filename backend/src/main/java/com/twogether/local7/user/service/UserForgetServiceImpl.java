// src/main/java/com/twogether/local7/user/service/impl/UserForgetServiceImpl.java
package com.twogether.local7.user.service;

import com.twogether.local7.user.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserForgetServiceImpl implements UserForgetService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> authCodeStore = new HashMap<>();
    private final Map<String, Long> authCodeExpiry = new HashMap<>();
    private static final long AUTH_CODE_VALIDITY_PERIOD = 5 * 60 * 1000; // 5분

    @Override
    @Transactional
    public boolean sendAuthCodeToEmail(String email) {
        String userId = userDAO.findUserLoginIdByEmail(email);
        if (userId == null) {
            return false;
        }

        String authCode = generateAuthCode();
        authCodeStore.put(email, authCode);
        authCodeExpiry.put(email, System.currentTimeMillis() + AUTH_CODE_VALIDITY_PERIOD);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("[서비스이름] 아이디/비밀번호 찾기 인증 코드");
            message.setText("인증 코드: " + authCode + "\n\n이 코드는 5분간 유효합니다.");
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public String verifyAuthCode(String email, String authCode) {
        String storedCode = authCodeStore.get(email);
        Long expiryTime = authCodeExpiry.get(email);

        // verifyAuthCode 메소드에서는 인증 코드를 삭제하지 않습니다.
        // 인증 코드는 resetPassword가 성공적으로 완료된 후에 삭제됩니다.
        if (storedCode != null && expiryTime != null && System.currentTimeMillis() < expiryTime && storedCode.equals(authCode)) {
            return userDAO.findUserLoginIdByEmail(email);
        }
        return null; // 인증 실패 (코드 불일치 또는 만료)
    }

    @Override
    @Transactional
    public boolean resetPassword(String email, String authCode, String newPassword) {
        // 1. 인증 코드 재확인
        String storedCode = authCodeStore.get(email);
        Long expiryTime = authCodeExpiry.get(email);

        if (storedCode == null || expiryTime == null || System.currentTimeMillis() >= expiryTime || !storedCode.equals(authCode)) {
            return false; // 인증 코드가 유효하지 않거나 만료됨
        }

        // 2. 비밀번호는 암호화 없이 평문으로 저장 (보안 경고: 실제 서비스에서는 암호화 사용 필수)
        String plainPassword = newPassword;

        // 3. DB에 비밀번호 업데이트
        Map<String, Object> params = new HashMap<>();
        params.put("userEmail", email);
        params.put("newPassword", plainPassword);
        int updatedRows = userDAO.updateUserPasswordByEmail(params);

        if (updatedRows > 0) {
            authCodeStore.remove(email); // 비밀번호 변경 성공 시 코드 삭제
            authCodeExpiry.remove(email); // 비밀번호 변경 성공 시 만료 시간 삭제
            return true;
        }
        return false;
    }

    private String generateAuthCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 숫자
        return String.valueOf(code);
    }
}