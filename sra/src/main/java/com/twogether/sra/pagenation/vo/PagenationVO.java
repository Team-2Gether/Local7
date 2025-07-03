// spring-boot-backend/src/main/java/com/twogether/sra/pagenation/vo/PagenationVO.java
package com.twogether.sra.pagenation.vo;

import lombok.Data;
import java.util.List; // 데이터 목록을 담기 위해 추가

@Data
public class PagenationVO<T> { // 제네릭을 사용하여 어떤 타입의 데이터든 담을 수 있도록 함
    private int page; // 현재 페이지 번호 (1부터 시작)
    private int size; // 페이지당 아이템 수
    private long totalCount; // 전체 아이템 수
    private int totalPages; // 전체 페이지 수
    private List<T> content; // 현재 페이지의 데이터 목록

    // 검색 조건 등을 추가할 수 있습니다.
    private String searchKeyword;
    private String searchType;

    // 편의를 위한 메소드 (선택 사항)
    public int getOffset() {
        return (page - 1) * size;
    }
}