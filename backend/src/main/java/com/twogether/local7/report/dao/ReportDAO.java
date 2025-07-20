package com.twogether.local7.report.dao;

import com.twogether.local7.report.vo.ReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ReportDAO {

    // 새로운 신고 정보 삽입
    void insertReport(ReportVO reportVO);

    // 관리자 페이지에서 사용할 모든 신고 내역 조회
    List<ReportVO> getAllReports();

    // 특정 신고의 상태 업데이트
    void updateReportStatus(@Param("reportId") Long reportId, @Param("status") String status);
}