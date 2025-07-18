package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.post.service.ImageService;
import com.twogether.local7.post.vo.ImageVO;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
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

        // 비밀번호 확인 (실제 앱에서는 비밀번호 해싱 후 비교)
        if (!user.getUserPassword().equals(password)) {
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
    public Pagination<PostDetailVO> getPostsByUserId(Long userId, Pageable pageable) { // PostDetailVO로 변경
        int totalPosts = userDAO.countPostsByUserId(userId);
        RowBounds rowBounds = new RowBounds((int) pageable.getOffset(), pageable.getPageSize());
        List<PostDetailVO> posts = userDAO.findPostsByUserId(userId, rowBounds); // PostDetailVO로 변경
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


    // 현재
    @Override
    public PostDetailVO getPostById(Long postId) {
        PostDetailVO post = userDAO.findPostById(postId);
        if (post != null) {
            List<ImageVO> images = imageService.getImagesByPostId(postId);
            post.setImages(images);
        }
        return post;
    }

    // 새로운 메서드 구현: 비밀번호 변경
    //
    @Override
    public void updateUserPassword(Long userId, String newPassword) {
        // 실제 애플리케이션에서는 newPassword를 해싱하여 저장해야 합니다.
        // 예: String hashedNewPassword = passwordEncoder.encode(newPassword);
        userDAO.updateUserPassword(userId, newPassword);
    }

    // 새로운 메서드 구현: 현재 비밀번호 확인
    //
    @Override
    public boolean checkUserPassword(Long userId, String currentPassword) {
        // 실제 애플리케이션에서는 currentPassword를 해싱하여 저장된 비밀번호와 비교해야 합니다.
        // 예: return passwordEncoder.matches(currentPassword, user.getUserPassword());
        String storedPassword = userDAO.findUserPassword(userId); // DB에서 암호화된 비밀번호 가져옴
        // 여기서는 예시로 일반 텍스트 비교 (실제로는 PasswordEncoder 사용)
        return currentPassword != null && storedPassword != null && currentPassword.equals(storedPassword);
    }

    @Override
    public void updateUserProfileImage(Long userId, String userProfileImageUrl) {
        userDAO.updateUserProfileImage(userId, userProfileImageUrl);
    }
}