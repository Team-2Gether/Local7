// SearchUserVO.java
package com.twogether.local7.searchuser.vo;

import lombok.Data;
import com.twogether.local7.pagintion.Pageable; // Pageable import 추가

@Data
public class SearchUserVO {
    private String keyword; // 검색 키워드 (예: 사용자 이름, 닉네임, 로그인 ID)
    private Pageable pageable; // 페이지네이션 정보

    // 검색 기준을 위한 필드 추가
    private String searchField; // 'all', 'userLoginId', 'userName', 'userNickname', 'userEmail'

    // MyBatis에서 동적 쿼리에 사용할 boolean 플래그 (선택된 searchField에 따라 설정)
    private boolean searchLoginId;
    private boolean searchName;
    private boolean searchNickname;
    private boolean searchEmail;

    // DAO에서 직접 사용할 startRow, endRow 계산을 위한 getter
    public long getStartRow() {
        if (pageable == null) {
            return 0; // 또는 기본값 처리
        }
        return pageable.getOffset() + 1; // Oracle ROWNUM은 1부터 시작
    }

    public long getEndRow() {
        if (pageable == null) {
            return 0; // 또는 기본값 처리
        }
        return pageable.getOffset() + pageable.getPageSize();
    }
}