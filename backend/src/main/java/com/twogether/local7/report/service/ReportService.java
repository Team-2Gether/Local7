package com.twogether.local7.report.service;

import com.twogether.local7.report.vo.ReportVO;
import java.util.List;

public interface ReportService {

    // 신고 생성
    void createReport(ReportVO reportVO);

    // 모든 신고 내역 조회 (Admin용)
    List<ReportVO> getAllReports();

    // 신고 상태 업데이트
    void updateReportStatus(Long reportId, String status);
}