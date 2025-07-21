package com.twogether.local7.searchuser.service;

import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.searchuser.vo.SearchUserVO;
import com.twogether.local7.pagintion.Pagination; // Pagination import 추가

public interface SearchUserService {
    Pagination<UserVO> searchUsers(SearchUserVO searchUserVO); // 반환 타입 변경
}