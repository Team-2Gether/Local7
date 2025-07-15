package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.pagintion.Pageable;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

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
    public void resetPassword(Long userId, String newPassword) {
        // 현재는 직접 비밀번호를 업데이트합니다.
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
        // 실제 이메일 인증 프로세스:
        // 1. userId를 통해 사용자 이메일 주소를 조회
        UserVO user = userDAO.findByUserId(userId);
        if (user == null || user.getUserEmail() == null) {
            throw new IllegalArgumentException("사용자 정보를 찾을 수 없거나 이메일이 등록되지 않았습니다.");
        }

        // 2. 인증 코드 생성 및 저장
        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode); // 임시 저장

        // 3. 이메일 발송
        sendVerificationEmail(user.getUserEmail(), verificationCode, "[TwoGether] 회원 탈퇴 인증 코드");
    }

    @Override
    public void deleteUser(Long userId, String password, String verificationCode) {
        // 1. 사용자 비밀번호 확인 (실제로는 암호화된 비밀번호와 대조)
        UserVO user = userDAO.findByUserId(userId);
        if (user == null || !user.getUserPassword().equals(password)) { // 실제로는 암호화 비교
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 2. 인증 코드 확인
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

    @Override
    public UserVO getUserProfileByLoginId(String userLoginId) {
        return userDAO.findByUserLoginId(userLoginId);
    }

    @Override
    public UserVO getUserProfileByNickname(String userNickname) {
        return userDAO.findByUserNickname(userNickname);
    }
}