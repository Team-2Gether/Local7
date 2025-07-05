// src/main/java/com/twogether/sra/user/service/UserServiceImpl.java
package com.twogether.sra.user.service;

import com.twogether.sra.user.dao.UserDAO;
import com.twogether.sra.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    public Mono<UserVO> login(String credential, String password) {
        return Mono.fromCallable(() -> {
            UserVO user = null;
            if (EMAIL_PATTERN.matcher(credential).matches()) {
                user = userDAO.findByUserEmail(credential);
            } else {
                user = userDAO.findByUserLoginId(credential);
            }

            if (user != null) {
                // IMPORTANT: In a real application, 'password' here should be hashed
                // and compared against a stored hash.
                // For this example, we're doing a direct string comparison as requested.
                if (user.getUserPassword().equals(password)) {
                    // Password matches, return the user object (excluding password for security)
                    user.setUserPassword(null); // Clear password before returning
                    return user;
                }
            }
            return null; // Return null on failed login
        });
    }
}