package com.twogether.sra.signup.service;

import com.twogether.sra.signup.dao.SignupDAO;
import com.twogether.sra.signup.vo.SignupVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SignupServiceImpl implements SignupService {

    @Autowired
    private SignupDAO signupDAO;

    @Autowired
    private JavaMailSender mailSender;

    // In-memory store for email verification codes.
    // IMPORTANT: For production, use a persistent store like Redis or a database.
    private final Map<String, String> emailVerificationCodes = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> registerUser(SignupVO signupVO) {
        // As per the request, password encryption is NOT used.
        // In a real application, you MUST encrypt passwords (e.g., using BCryptPasswordEncoder).
        return Mono.fromRunnable(() -> signupDAO.insertUser(signupVO));
    }

    @Override
    public Mono<String> sendVerificationEmail(String email) {
        return Mono.fromCallable(() -> {
            String verificationCode = generateVerificationCode(4); // Generate a 4-digit code
            emailVerificationCodes.put(email, verificationCode); // Store the code temporarily

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("[투게더] 이메일 인증 코드"); // Email subject
            message.setText("귀하의 이메일 인증 코드는 " + verificationCode + " 입니다. 5분 이내로 입력해주세요."); // Email body
            mailSender.send(message); // Send the email

            // For development/debugging, you might return the code.
            // In production, consider just returning success/failure.
            return verificationCode;
        });
    }

    @Override
    public Mono<Boolean> verifyEmailCode(String email, String code) {
        return Mono.fromCallable(() -> {
            String storedCode = emailVerificationCodes.get(email);
            boolean isValid = storedCode != null && storedCode.equals(code);
            if (isValid) {
                emailVerificationCodes.remove(email); // Invalidate the code after successful verification
            }
            return isValid;
        });
    }

    @Override
    public Mono<Boolean> isLoginIdDuplicate(String userLoginId) {
        return Mono.fromCallable(() -> signupDAO.countByUserLoginId(userLoginId) > 0);
    }

    @Override
    public Mono<Boolean> isEmailDuplicate(String userEmail) {
        return Mono.fromCallable(() -> signupDAO.countByUserEmail(userEmail) > 0);
    }

    @Override
    public Mono<Boolean> isNicknameDuplicate(String userNickname) {
        return Mono.fromCallable(() -> signupDAO.countByUserNickname(userNickname) > 0);
    }

    // Helper method to generate a random numeric verification code
    private String generateVerificationCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10)); // Append a random digit (0-9)
        }
        return code.toString();
    }
}