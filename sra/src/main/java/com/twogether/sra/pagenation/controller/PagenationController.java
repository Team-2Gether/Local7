// spring-boot-backend/src/main/java/com/twogether/sra/pagenation/controller/PagenationController.java
package com.twogether.sra.pagenation.controller;

import com.twogether.sra.pagenation.service.PagenationService;
import com.twogether.sra.pagenation.vo.PagenationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pagenation") // API 엔드포인트 경로
public class PagenationController {

    private final PagenationService pagenationService;

    public PagenationController(PagenationService pagenationService) {
        this.pagenationService = pagenationService;
    }

    /**
     * 페이징 처리된 데이터를 조회하는 API 엔드포인트
     * 예시 URL: /api/pagenation?page=0&size=10&sort=id,desc&searchKeyword=test&searchType=title
     *
     * @param pageable Spring이 자동으로 바인딩해주는 Pageable 객체 (page, size, sort 파라미터 처리)
     * page: 0부터 시작 (기본값 0)
     * size: 페이지당 아이템 수 (기본값 10)
     * sort: 정렬 기준 (예: id,desc 또는 name,asc)
     * @param searchKeyword 검색 키워드 (선택 사항)
     * @param searchType 검색 타입 (선택 사항)
     * @return 페이징 처리된 데이터와 함께 HTTP 200 OK 응답
     */
    @GetMapping
    public ResponseEntity<Page<PagenationVO<?>>> getPagedItems(
            @PageableDefault(page = 0, size = 10) Pageable pageable, // 기본값 설정
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) String searchType) {

        Page<PagenationVO<?>> pagedData = pagenationService.getPagedData(pageable, searchKeyword, searchType);
        return ResponseEntity.ok(pagedData);
    }
}