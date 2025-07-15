package com.twogether.local7.pagintion; // 패키지 경로 변경

public interface Pageable {
    int getPageNumber();
    int getPageSize();
    long getOffset();
}