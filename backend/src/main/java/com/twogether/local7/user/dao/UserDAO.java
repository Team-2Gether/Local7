// src/main/java/com/twogether/local7/user/dao/UserDAO.java
package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map; // Map import 추가

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserId(Long userId);

    int countByUserLoginId(String userLoginId);

    void updateUserLoginId(Long userId, String newUserLoginId);

    int countByUserNickname(String userNickname);
    void updateUserNickname(Long userId, String newUserNickname);
    void deleteUser(Long userId);

    List<PostDetailVO> findPostsByUserId(Long userId, RowBounds rowBounds);

    int countPostsByUserId(Long userId);

    UserVO findByUserLoginId(String userLoginId);

    UserVO findByUserNickname(String userNickname);

    PostDetailVO findPostById(Long postId);

    void updateUserPassword(Long userId, String newPassword);

    String findUserPassword(Long userId);

    void updateUserProfileImage(Long userId, String userProfileImageUrl);

    // 새롭게 추가된 부분
    void updateUserBio(Long userId, String userBio);

    // --- 아이디/비밀번호 찾기 기능 추가 ---
    // 이메일로 사용자 로그인 ID 찾기
    String findUserLoginIdByEmail(String userEmail);

    // 이메일로 사용자 비밀번호 업데이트
    int updateUserPasswordByEmail(Map<String, Object> params);
}