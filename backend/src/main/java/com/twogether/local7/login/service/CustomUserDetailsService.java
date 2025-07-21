package com.twogether.local7.login.service; // config 패키지에 생성하거나 service 패키지에 생성 가능

import com.twogether.local7.login.dao.LoginDAO;
import com.twogether.local7.login.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginDAO loginDAO;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Override
    public UserDetails loadUserByUsername(String credential) throws UsernameNotFoundException {
        LoginVO user = null;
        if (EMAIL_PATTERN.matcher(credential).matches()) {
            user = loginDAO.findByUserEmail(credential);
        } else {
            user = loginDAO.findByUserLoginId(credential);
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found with credential: " + credential);
        }
        return user;
    }
}