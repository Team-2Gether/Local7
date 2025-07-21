package com.twogether.local7.searchuser.dao;

import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.searchuser.vo.SearchUserVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper // MyBatis 매퍼 인터페이스임을 명시합니다.
public interface SearchUserDAO {
    List<UserVO> searchUsers(SearchUserVO searchUserVO);
    int countSearchUsers(SearchUserVO searchUserVO); // 검색된 사용자 수 카운트
}