package com.twogether.local7.user.service;

import com.twogether.local7.pagention.Pagination;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.pagention.Pageable;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private JavaMailSender mailSender;

    // 임시로 인증 코드를 저장할 맵 (실제 앱에서는 DB나 Redis 사용)
    private final Map<Long, String> verificationCodes = new HashMap<>();

    @Override
    public boolean checkLoginIdDuplicate(String userLoginId) {
        return userDAO.countByUserLoginId(userLoginId) > 0;
    }

    @Override
    public void updateUserLoginId(Long userId, String newUserLoginId) {
        userDAO.updateUserLoginId(userId, newUserLoginId);
    }

    @Override
    public void resetPassword(Long userId, String newPassword) { // 이메일 인증 기능 제거에 따라 파라미터 변경
        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        // 비밀번호 재설정 시 현재 비밀번호 검증 로직은 컨트롤러/프론트엔드에서 처리하도록 변경
        // 이메일 인증을 통한 비밀번호 변경이 아닌, 현재 비밀번호를 알고 변경하는 방식으로 가정
        userDAO.updateUserPassword(userId, newPassword);
    }

    @Override
    public boolean checkNicknameDuplicate(String userNickname) {
        return userDAO.countByUserNickname(userNickname) > 0;
    }

    @Override
    public void updateUserNickname(Long userId, String newUserNickname) {
        userDAO.updateUserNickname(userId, newUserNickname);
    }

    @Override
    public void requestWithdrawalVerification(Long userId) {
        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode);

        sendVerificationEmail(user.getUserEmail(), verificationCode, "local seven 회원 탈퇴 인증 코드");
        System.out.println("회원 탈퇴 인증 코드 발송: " + user.getUserEmail() + ", 코드: " + verificationCode);
    }

    @Override
    public void deleteUser(Long userId, String password, String verificationCode) {
        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        if (!user.getUserPassword().equals(password)) {
            throw new RuntimeException("비밀번호가 일치하지 않아 회원 탈퇴를 진행할 수 없습니다.");
        }

        String storedCode = verificationCodes.get(userId);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new RuntimeException("인증코드가 유효하지 않거나 만료되었습니다.");
        }

        verificationCodes.remove(userId);

        userDAO.deleteUser(userId);
    }

    private String generateVerificationCode() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            if (random.nextBoolean()) {
                code.append((char) ('A' + random.nextInt(26)));
            } else {
                code.append(random.nextInt(10));
            }
        }
        return code.toString();
    }

    private void sendVerificationEmail(String to, String verificationCode, String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText("인증 코드: " + verificationCode + "\n\n이 코드를 입력하여 본인임을 인증해주세요.");
        mailSender.send(message);
    }

    @Override
    public Pagination<PostVO> getPostsByUserId(Long userId, Pageable pageable) {
        int totalPosts = userDAO.countPostsByUserId(userId);
        RowBounds rowBounds = new RowBounds((int) pageable.getOffset(), pageable.getPageSize());
        List<PostVO> posts = userDAO.findPostsByUserId(userId, rowBounds);
        return new Pagination<>(posts, pageable, totalPosts);
    }

    @Override
    public int countPostsByUserId(Long userId) {
        return userDAO.countPostsByUserId(userId);
    }
}