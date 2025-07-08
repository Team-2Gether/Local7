package com.twogether.local7.user.service;

import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage; // 추가
import org.springframework.mail.javamail.JavaMailSender; // 추가
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private JavaMailSender mailSender; // JavaMailSender 주입

    // 임시로 인증 코드를 저장할 맵 (실제 앱에서는 DB나 Redis 사용)
    private final Map<Long, String> verificationCodes = new HashMap<>();

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    public UserVO login(String credential, String password) {
        UserVO user = null;
        if (EMAIL_PATTERN.matcher(credential).matches()) {
            user = userDAO.findByUserEmail(credential);
        } else {
            user = userDAO.findByUserLoginId(credential);
        }

        //사용자정보가유효하지않으면즉시null을반환
        if (!isValidUser(user)) {
            throw new RuntimeException("User not found");
        }

        //IMPORTANT:Inarealapplication,'password'hereshouldbehasehd
        //andcomparedagainstaStoredhash.
        //Forthisexample,we're doingadirectstringcomparisonasrequested.
        if (user.getUserPassword().equals(password)) {
            //Passwordmatches,returntheuserobject(excludingpasswordforsecurity)
            user.setUserPassword(null);
            return user;
        } else {
            throw new RuntimeException("Password mismatch");
        }
    }

    //사용자계정이유효한지확인하는메서드
    private boolean isValidUser(UserVO user) {
        return user != null && user.getUserId() != null;
    }

    @Override
    public boolean checkLoginIdDuplicate(String userLoginId) {
        return userDAO.countByUserLoginId(userLoginId) > 0;
    }

    @Override
    public void updateUserLoginId(Long userId, String newUserLoginId) {
        userDAO.updateUserLoginId(userId, newUserLoginId);
    }

    @Override
    public void requestPasswordChange(Long userId, String currentPassword) {
        UserVO user = userDAO.findByUserLoginId(String.valueOf(userId)); // Assuming userId can be used to find user
        if (user == null || !user.getUserPassword().equals(currentPassword)) {
            throw new RuntimeException("현재비밀번호가일치하지않습니다.");
        }

        // 인증 코드 생성
        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode); // 인증 코드 저장 (임시)

        // 실제 이메일 발송
        sendVerificationEmail(user.getUserEmail(), verificationCode); // 수정: EmailService 통합
        System.out.println("인증 코드 발송 (실제로 이메일 발송): " + user.getUserEmail() + ", 코드: " + verificationCode);
    }

    @Override
    public void resetPassword(Long userId, String verificationCode, String newPassword) {
        // 저장된 인증 코드와 비교
        String storedCode = verificationCodes.get(userId);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new RuntimeException("인증코드가 유효하지 않거나 만료되었습니다.");
        }

        // 인증 코드 사용 후 삭제 (선택 사항)
        verificationCodes.remove(userId);

        userDAO.updateUserPassword(userId, newPassword);
    }

    // 6자리 난수 인증 코드 생성 메서드
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 100000 ~ 999999 범위의 6자리 숫자
        return String.valueOf(code);
    }

    // 이메일 발송 메서드 (EmailService 통합)
    private void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("비밀번호 재설정 인증 코드");
        message.setText("요청하신 비밀번호 재설정 인증 코드입니다: " + verificationCode + "\n이 코드는 5분간 유효합니다.");
        mailSender.send(message);
    }
}