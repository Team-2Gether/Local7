package com.twogether.local7.report.controller;

import com.twogether.local7.report.dto.ReportStatusUpdateDTO;
import com.twogether.local7.report.service.ReportService;
import com.twogether.local7.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports") // 관리자 엔드포인트에 맞춰 경로 변경
public class ReportController {

    @Autowired
    private ReportService reportService;

//    // 관리자: 모든 신고 내역 조회 API (GET /api/admin/reports)
//    @GetMapping({"", "/"})
//    public ResponseEntity<Map<String, Object>> getAllReports() {
//        Map<String, Object> response = new HashMap<>();
//        try {
//            List<ReportVO> reports = reportService.getAllReports();
//            response.put("status", "success");
//            response.put("message", "신고 내역을 성공적으로 조회했습니다.");
//            response.put("reports", reports);
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("status", "error");
//            response.put("message", "신고 내역 조회 중 오류가 발생했습니다: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }

    // 관리자: 신고 상태 업데이트 API (POST /api/admin/reports/{reportId}/status)
    @PostMapping("/{reportId}/status")
    public ResponseEntity<Map<String, Object>> updateReportStatus(@PathVariable Long reportId, @RequestBody ReportStatusUpdateDTO updateDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            reportService.updateReportStatus(reportId, updateDto.getStatus());
            response.put("status", "success");
            response.put("message", "신고 상태가 성공적으로 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "신고 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}