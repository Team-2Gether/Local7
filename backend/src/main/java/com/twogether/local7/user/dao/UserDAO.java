package com.twogether.local7.user.dao;

import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.user.vo.PostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds; // RowBounds import 추가
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserId(Long userId);

    int countByUserLoginId(String userLoginId);

    void updateUserLoginId(Long userId, String newUserLoginId);

    // 닉네임 중복 확인
    int countByUserNickname(String userNickname);
    // 닉네임 변경
    void updateUserNickname(Long userId, String newUserNickname);
    // 회원 탈퇴 (사용자 삭제)
    void deleteUser(Long userId);

    // 수정된 메서드: Pagination을 위한 RowBounds 추가
    List<PostVO> findPostsByUserId(Long userId, RowBounds rowBounds); // RowBounds 파라미터 추가

    // 추가된 메서드: 특정 사용자의 총 게시글 수 조회
    int countPostsByUserId(Long userId);

    // 로그인 ID로 사용자 정보 조회
    UserVO findByUserLoginId(String userLoginId);

    // 닉네임으로 사용자 정보 조회
    UserVO findByUserNickname(String userNickname);

    // 게시글 ID로 단일 게시글 조회 추가
    PostVO findPostById(Long postId); // 메서드 이름 변경: findById -> findPostById (충돌 방지)
}