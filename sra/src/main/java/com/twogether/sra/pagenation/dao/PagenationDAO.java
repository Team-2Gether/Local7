// spring-boot-backend/src/main/java/com/twogether/sra/pagenation/dao/PagenationDAO.java
package com.twogether.sra.pagenation.dao;

import com.twogether.sra.pagenation.vo.PagenationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PagenationDAO {

    /**
     * 특정 테이블에서 페이지네이션된 데이터를 조회합니다.
     * @param offset 시작 위치
     * @param limit 가져올 데이터 수 (페이지 크기)
     * @param searchKeyword 검색 키워드 (선택 사항)
     * @param searchType 검색 타입 (선택 사항)
     * @return 조회된 데이터 목록
     */
    // 제네릭 T는 Mybatis Mapper에서 직접 인식하기 어려우므로, 특정 VO 타입을 명시하거나 Map 등으로 처리합니다.
    // 여기서는 일단 Map으로 예시를 들고, 실제 구현 시 특정 VO로 대체하거나 동적 SQL을 활용합니다.
    List<PagenationVO<?>> selectPagedData(@Param("offset") int offset,
                                          @Param("limit") int limit,
                                          @Param("searchKeyword") String searchKeyword,
                                          @Param("searchType") String searchType);

    /**
     * 특정 테이블의 전체 데이터 개수를 조회합니다.
     * @param searchKeyword 검색 키워드 (선택 사항)
     * @param searchType 검색 타입 (선택 사항)
     * @return 전체 데이터 개수
     */
    long countTotalData(@Param("searchKeyword") String searchKeyword,
                        @Param("searchType") String searchType);

    // 예시: 게시판 데이터를 위한 구체적인 메소드 (만약 BoardDAO 대신 PagenationDAO에서 직접 처리한다면)
    // List<BoardVO> selectPagedBoards(@Param("offset") int offset, @Param("limit") int limit);
    // long countTotalBoards();
}