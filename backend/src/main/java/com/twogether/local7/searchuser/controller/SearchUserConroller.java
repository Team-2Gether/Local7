// SearchUserConroller.java
package com.twogether.local7.searchuser.controller;

import com.twogether.local7.searchuser.service.SearchUserService;
import com.twogether.local7.searchuser.vo.SearchUserVO;
import com.twogether.local7.user.vo.UserVO;
import com.twogether.local7.pagintion.Pagination; // Pagination import 추가
import com.twogether.local7.pagintion.SimplePageable; // SimplePageable import 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchUserConroller {

    @Autowired
    private SearchUserService searchUserService;

    // GET 요청으로 사용자 검색 및 페이징
    // 예시 URL: /api/search/users?keyword=test&page=0&pageSize=10&searchField=userLoginId
    // Pageable의 pageNumber는 0부터 시작하므로 클라이언트에서도 0부터 보내는 것이 좋습니다.
    @GetMapping("/users")
    public ResponseEntity<Pagination<UserVO>> searchUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page, // pageNumber는 0부터 시작
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "searchField", defaultValue = "all") String searchField // 검색 기준 추가
    ) {
        // Pageable 객체 생성
        SimplePageable pageable = new SimplePageable(page, pageSize);

        SearchUserVO searchUserVO = new SearchUserVO();
        searchUserVO.setKeyword(keyword);
        searchUserVO.setPageable(pageable); // SearchUserVO에 Pageable 설정
        searchUserVO.setSearchField(searchField); // 검색 기준 설정

        // searchField에 따라 개별 검색 필드 플래그 설정
        if ("all".equals(searchField)) {
            searchUserVO.setSearchLoginId(true);
            searchUserVO.setSearchName(true);
            searchUserVO.setSearchNickname(true);
            searchUserVO.setSearchEmail(true);
        } else if ("userLoginId".equals(searchField)) {
            searchUserVO.setSearchLoginId(true);
        } else if ("userName".equals(searchField)) {
            searchUserVO.setSearchName(true);
        } else if ("userNickname".equals(searchField)) {
            searchUserVO.setSearchNickname(true);
        } else if ("userEmail".equals(searchField)) {
            searchUserVO.setSearchEmail(true);
        }
        // 나머지 필드는 기본적으로 false이므로 따로 설정하지 않아도 됩니다.

        Pagination<UserVO> paginationResult = searchUserService.searchUsers(searchUserVO);

        if (paginationResult.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        }
        return new ResponseEntity<>(paginationResult, HttpStatus.OK); // 200 OK
    }
}