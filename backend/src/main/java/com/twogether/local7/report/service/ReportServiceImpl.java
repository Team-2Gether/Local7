package com.twogether.local7.report.service;

import com.twogether.local7.report.dao.ReportDAO;
import com.twogether.local7.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportDAO reportDAO;

    @Override
    public void createReport(ReportVO reportVO) {
        // 신고 유형(게시글, 댓글 등)에 대한 유효성 검사 로직 추가 가능
        if (reportVO.getReportType() == null || reportVO.getReportReason() == null) {
            throw new IllegalArgumentException("신고 유형과 사유는 필수 입력 항목입니다.");
        }
        reportDAO.insertReport(reportVO);
    }

    @Override
    public List<ReportVO> getAllReports() {
        return reportDAO.getAllReports();
    }

    @Override
    public void updateReportStatus(Long reportId, String status) {
        reportDAO.updateReportStatus(reportId, status);
    }
}