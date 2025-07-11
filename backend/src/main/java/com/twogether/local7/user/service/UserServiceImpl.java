// UserServiceImpl.java
package com.twogether.local7.user.service;

import com.twogether.local7.pagention.Pagination;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import com.twogether.local7.pagention.Pageable; // Custom Pageable import 추가
import org.apache.ibatis.session.RowBounds; // RowBounds import 추가
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

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    public UserVO login(String credential, String password) {
        UserVO user = null;
        if (EMAIL_PATTERN.matcher(credential).matches()) {
            user = userDAO.findByUserEmail(credential);
        } else {
            user = userDAO.findByUserLoginId(credential);
        }

        if (!isValidUser(user)) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
        }

        if (!user.getUserPassword().equals(password)) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    private boolean isValidUser(UserVO user) {
        return user != null;
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
        UserVO user = userDAO.findByUserId(userId);
        if (user == null || !user.getUserPassword().equals(currentPassword)) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode);

        sendVerificationEmail(user.getUserEmail(), verificationCode, "비밀번호 변경 인증 코드");
        System.out.println("비밀번호 변경 인증 코드 발송: " + user.getUserEmail() + ", 코드: " + verificationCode);
    }

    @Override
    public void resetPassword(Long userId, String verificationCode, String newPassword) {
        String storedCode = verificationCodes.get(userId);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new RuntimeException("인증코드가 유효하지 않거나 만료되었습니다.");
        }

        verificationCodes.remove(userId);

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

        verificationCodes.remove(userId); // 인증 성공 후 코드 삭제

        userDAO.deleteUser(userId);
    }

    private String generateVerificationCode() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            if (random.nextBoolean()) { // 50% 확률로 영문 대문자
                code.append((char) ('A' + random.nextInt(26)));
            } else { // 50% 확률로 숫자
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

    // 수정된 메서드 구현
    @Override
    public Pagination<PostVO> getPostsByUserId(Long userId, Pageable pageable) {
        int totalPosts = userDAO.countPostsByUserId(userId); // 총 게시글 수 조회
        // RowBounds를 사용하여 페이지네이션 처리
        RowBounds rowBounds = new RowBounds((int) pageable.getOffset(), pageable.getPageSize());
        List<PostVO> posts = userDAO.findPostsByUserId(userId, rowBounds); // 페이지네이션된 게시글 조회
        return new Pagination<>(posts, pageable, totalPosts); // Pagination 객체 반환
    }

    // 추가된 메서드 구현
    @Override
    public int countPostsByUserId(Long userId) {
        return userDAO.countPostsByUserId(userId);
    }
}