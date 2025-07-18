package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostDetailVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Repository;
import java.util.List;

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
}