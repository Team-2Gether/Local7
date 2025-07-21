package com.twogether.local7.searchuser.service;

import com.twogether.local7.searchuser.dao.SearchUserDAO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.searchuser.vo.SearchUserVO;
import com.twogether.local7.pagintion.Pagination; // Pagination import 추가
import com.twogether.local7.pagintion.Pageable; // Pageable import 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchUserServiceImpl implements SearchUserService {

    @Autowired
    private SearchUserDAO searchUserDAO;

    @Override
    public Pagination<UserVO> searchUsers(SearchUserVO searchUserVO) {
        // 1. 전체 검색 결과 개수 조회
        int totalCount = searchUserDAO.countSearchUsers(searchUserVO);

        // 2. 페이징 처리된 사용자 목록 조회
        List<UserVO> userList = searchUserDAO.searchUsers(searchUserVO);

        // 3. Pagination 객체 생성 및 반환
        // searchUserVO.getPageable()을 통해 현재 페이지 정보를 가져옵니다.
        Pageable currentPageable = searchUserVO.getPageable();
        // 페이지네이션 객체 생성 시, currentPageable이 null이 아닌지 확인하고,
        // 필요에 따라 기본 Pageable 객체를 제공하는 로직을 추가할 수 있습니다.
        // 현재는 컨트롤러에서 항상 SimplePageable을 생성하여 넘겨주므로 null일 가능성은 낮습니다.

        return new Pagination<>(userList, currentPageable, totalCount);
    }
}