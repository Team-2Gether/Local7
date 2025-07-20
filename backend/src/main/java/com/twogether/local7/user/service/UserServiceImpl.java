// src/main/java/com/twogether/local7/user/service/impl/UserServiceImpl.java
package com.twogether.local7.user.service.impl;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.post.service.ImageService;
import com.twogether.local7.post.vo.ImageVO;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.service.UserService;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
import com.twogether.local7.pagintion.Pageable;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // BCryptPasswordEncoder 제거
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
    private final Map<Long, String> pendingLoginIdChanges = new HashMap<>(); // 아이디 변경 요청 시 임시 저장

    // private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // BCryptPasswordEncoder 인스턴스 제거

    @Override
    public boolean checkLoginIdDuplicate(String userLoginId) {
        return userDAO.countByUserLoginId(userLoginId) > 0;
    }

    @Override
    public void requestLoginIdChangeVerification(Long userId, String newUserLoginId) {
        // 새 아이디 중복 확인
        if (checkLoginIdDuplicate(newUserLoginId)) {
            throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        if (user.getUserLoginId().equals(newUserLoginId)) {
            throw new IllegalArgumentException("현재 아이디와 동일합니다. 다른 아이디를 입력해주세요.");
        }

        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode); // 인증 코드 저장
        pendingLoginIdChanges.put(userId, newUserLoginId); // 변경될 아이디 임시 저장

        // 이메일 발송
        sendVerificationEmail(user.getUserEmail(), verificationCode, "[TwoGether] 아이디 변경 인증 코드");
    }

    @Override
    public void confirmUserLoginIdChange(Long userId, String newUserLoginId, String verificationCode) {
        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 저장된 아이디 변경 요청과 일치하는지 확인
        String storedNewLoginId = pendingLoginIdChanges.get(userId);
        if (storedNewLoginId == null || !storedNewLoginId.equals(newUserLoginId)) {
            throw new IllegalArgumentException("유효하지 않은 아이디 변경 요청입니다.");
        }

        // 인증 코드 확인
        String storedCode = verificationCodes.get(userId);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 인증 코드입니다.");
        }

        userDAO.updateUserLoginId(userId, newUserLoginId);
        verificationCodes.remove(userId); // 사용된 인증 코드 삭제
        pendingLoginIdChanges.remove(userId); // 사용된 임시 아이디 삭제
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
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        String verificationCode = generateVerificationCode();
        verificationCodes.put(userId, verificationCode); // 인증 코드 저장

        // 이메일 발송
        sendVerificationEmail(user.getUserEmail(), verificationCode, "[TwoGether] 회원 탈퇴 인증 코드");
    }

    @Override
    public void deleteUser(Long userId, String password, String verificationCode) {
        UserVO user = userDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 비밀번호 확인 (일반 문자열 비교) - 보안 경고: 실제 서비스에서는 암호화된 비밀번호 비교를 사용해야 합니다.
        if (!user.getUserPassword().equals(password)) { // BCryptPasswordEncoder.matches 대신 일반 equals 사용
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 인증 코드 확인
        String storedCode = verificationCodes.get(userId);
        if (storedCode == null || !storedCode.equals(verificationCode)) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 인증 코드입니다.");
        }

        userDAO.deleteUser(userId);
        verificationCodes.remove(userId); // 사용된 인증 코드 삭제
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
    public Pagination<PostDetailVO> getPostsByUserId(Long userId, Pageable pageable) {
        int totalPosts = userDAO.countPostsByUserId(userId);
        RowBounds rowBounds = new RowBounds((int) pageable.getOffset(), pageable.getPageSize());
        List<PostDetailVO> posts = userDAO.findPostsByUserId(userId, rowBounds);
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

    @Autowired
    private ImageService imageService;

    @Override
    public PostDetailVO getPostById(Long postId) {
        PostDetailVO post = userDAO.findPostById(postId);
        if (post != null) {
            List<ImageVO> images = imageService.getImagesByPostId(postId);
            post.setImages(images);
        }
        return post;
    }

    @Override
    public void updateUserPassword(Long userId, String newPassword) {
        // 기존 updateUserPassword는 userId 기반이므로 그대로 유지.
        // 비밀번호는 이미 암호화되지 않은 상태로 전달될 것을 가정.
        userDAO.updateUserPassword(userId, newPassword); // 암호화 없이 바로 저장
    }

    @Override
    public boolean checkUserPassword(Long userId, String currentPassword) {
        String storedPassword = userDAO.findUserPassword(userId);
        // 비밀번호 암호화가 없으므로 일반 문자열 비교
        return currentPassword != null && storedPassword != null && currentPassword.equals(storedPassword);
    }

    @Override
    public void updateUserProfileImage(Long userId, String userProfileImageUrl) {
        userDAO.updateUserProfileImage(userId, userProfileImageUrl);
    }

    // 새롭게 추가된 부분
    @Override
    public void updateUserBio(Long userId, String userBio) {
        userDAO.updateUserBio(userId, userBio);
    }
}