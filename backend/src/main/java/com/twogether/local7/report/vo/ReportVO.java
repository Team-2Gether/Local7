package com.twogether.local7.report.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReportVO {

    private Long reportId;
    private Long reporterId;
    private Long targetId;
    private String reportType;
    private String reportReason;
    private String status;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;

    // 신고한 사용자 닉네임
    private String reporterNickname;

    // 신고 대상 정보
    private String postTitle;
    private String commentContent;

    // 신고 대상 닉네임
    private String targetNickname;
}