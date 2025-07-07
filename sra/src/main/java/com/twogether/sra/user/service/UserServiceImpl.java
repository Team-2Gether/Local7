package com.twogether.sra.user.service;

import com.twogether.sra.user.dao.UserDAO;
import com.twogether.sra.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

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
            throw new RuntimeException("User not found"); //사용자를찾을수없는경우명확한예외발생
        }

        //IMPORTANT:Inarealapplication,'password'hereshouldbehasehd
        //andcomparedagainstaStoredhash.
        //Forthisexample,we're doingadirectstringcomparisonasrequested.
        if (user.getUserPassword().equals(password)) {
            //Passwordmatches,returntheuserobject(excludingpasswordforsecurity)
            user.setUserPassword(null); //Clearpasswordbeforereturning
            return user;
        } else {
            throw new RuntimeException("Password mismatch"); //비밀번호가일치하지않는경우명확한예외발생
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
        //TODO:이메일발송및인증코드저장로직추가
        System.out.println("인증코드발송(실제로는이메일로발송):"+user.getUserEmail());
    }

    @Override
    public void resetPassword(Long userId, String verificationCode, String newPassword) {
        //TODO:인증코드확인로직추가(예:저장된코드와비교)
        if (!"123456".equals(verificationCode)) { //임시인증코드"123456"
            throw new RuntimeException("인증코드가유효하지않습니다.");
        }
        userDAO.updateUserPassword(userId, newPassword);
    }
}