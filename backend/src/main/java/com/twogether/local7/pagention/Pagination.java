package com.twogether.local7.pagention; // 패키지 경로 변경

import java.util.List;

// org.springframework.data.domain.Pageable 대신 local7.pagention.Pageable 사용
import com.twogether.local7.pagention.Pageable;

public class Pagination<T> {
    private final List<T> content;
    private final Pageable pageable;
    private final long totalElements;

    public Pagination(List<T> content, Pageable pageable, long totalElements) {
        if (content == null) {
            throw new IllegalArgumentException("Content must not be null!");
        }
        if (pageable == null) {
            throw new IllegalArgumentException("Pageable must not be null!");
        }
        if (totalElements < 0) {
            throw new IllegalArgumentException("Total elements must not be less than zero!");
        }

        this.content = content;
        this.pageable = pageable;
        this.totalElements = totalElements;
    }

    public List<T> getContent() {
        return content;
    }

    public int getPageNumber() {
        return pageable.getPageNumber();
    }

    public int getPageSize() {
        return pageable.getPageSize();
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        if (pageable.getPageSize() == 0) {
            return 0;
        }
        return (int) Math.ceil((double) totalElements / pageable.getPageSize());
    }

    public boolean hasPrevious() {
        return getPageNumber() > 0;
    }

    public boolean hasNext() {
        return getPageNumber() + 1 < getTotalPages();
    }

    public boolean isFirst() {
        return !hasPrevious();
    }

    public boolean isLast() {
        return !hasNext();
    }

    public boolean isEmpty() {
        return content.isEmpty();
    }

    @Override
    public String toString() {
        return "Pagination{" +
                "contentSize=" + content.size() +
                ", pageNumber=" + getPageNumber() +
                ", pageSize=" + getPageSize() +
                ", totalElements=" + totalElements +
                ", totalPages=" + getTotalPages() +
                '}';
    }
}