// spring-boot-backend/src/main/java/com/twogether/sra/pagenation/service/PagenationService.java
package com.twogether.sra.pagenation.service;

import com.twogether.sra.pagenation.vo.PagenationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PagenationService {

    /**
     * Pageable 객체를 이용하여 페이징 처리된 데이터를 조회합니다.
     * @param pageable 페이징 및 정렬 정보
     * @param searchKeyword 검색 키워드 (선택 사항)
     * @param searchType 검색 타입 (선택 사항)
     * @return 페이징 처리된 데이터 (Spring Page 객체)
     */
    Page<PagenationVO<?>> getPagedData(Pageable pageable, String searchKeyword, String searchType);

    // 특정 VO 타입을 위한 메소드를 추가할 수 있습니다.
    // Page<BoardVO> getPagedBoards(Pageable pageable, String searchKeyword);
}