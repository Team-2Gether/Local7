package com.twogether.local7.report.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportVO {

    private Long reportId;
    private Long reporterId;
    private Long targetId;
    private String reportType;          // 게시글, 댓글, 사용자
    private String reportReason;
    private String status;              // 처리 상태 (예: PENDING, PROCESSED)
    private LocalDateTime createdDate;
    private String createdId;
    private LocalDateTime updatedDate;
    private String updatedId;

}