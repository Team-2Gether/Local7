package com.twogether.local7.user.service;

import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.post.service.ImageService;
import com.twogether.local7.post.vo.ImageVO;
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

    @Autowired
    private ImageService imageService;


    // 현재
    @Override
    public PostVO getPostById(Long postId) {
        PostVO post = userDAO.findPostById(postId);
        if (post != null) {
            List<ImageVO> images = imageService.getImagesByPostId(postId);
            post.setImages(images);
        }
        return post;
    }
}