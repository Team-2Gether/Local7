// spring-boot-backend/src/main/java/com/twogether/sra/pagenation/service/PagenationServiceImpl.java
package com.twogether.sra.pagenation.service;

import com.twogether.sra.pagenation.dao.PagenationDAO;
import com.twogether.sra.pagenation.vo.PagenationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // 데이터 변환을 위해 추가

@Service
public class PagenationServiceImpl implements PagenationService {

    private final PagenationDAO pagenationDAO;

    public PagenationServiceImpl(PagenationDAO pagenationDAO) {
        this.pagenationDAO = pagenationDAO;
    }

    @Override
    public Page<PagenationVO<?>> getPagedData(Pageable pageable, String searchKeyword, String searchType) {
        // 1. 전체 데이터 개수 조회
        long totalCount = pagenationDAO.countTotalData(searchKeyword, searchType);

        // 2. 현재 페이지에 해당하는 데이터 조회
        // MyBatis의 LIMIT, OFFSET을 사용하기 위해 pageable.getPageSize(), pageable.getOffset() 활용
        List<PagenationVO<?>> content = pagenationDAO.selectPagedData(
                (int) pageable.getOffset(), // offset은 long 타입이므로 int로 캐스팅
                pageable.getPageSize(),
                searchKeyword,
                searchType
        );

        // 조회된 데이터를 PagenationVO 리스트로 변환 (필요한 경우)
        // 예를 들어, PagenationDAO가 raw Map이나 다른 VO를 반환할 경우 여기서 PagenationVO로 맵핑할 수 있습니다.
        // 현재 PagenationDAO가 PagenationVO<?>를 반환하도록 예시를 들었으므로, 단순 반환합니다.
        // List<PagenationVO<?>> pagenatedContent = content.stream()
        //         .map(item -> {
        //             PagenationVO<?> vo = new PagenationVO<>();
        //             // item의 필드를 vo에 매핑
        //             return vo;
        //         })
        //         .collect(Collectors.toList());


        // 3. Spring의 Page 객체로 묶어 반환
        return new PageImpl<>(content, pageable, totalCount);
    }
}