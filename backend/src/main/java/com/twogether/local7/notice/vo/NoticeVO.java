package com.twogether.local7.notice.vo;

import java.sql.Timestamp;

public class NoticeVO {
    private Long notice_Id;
    private Long user_Id;
    private String notice_Title;
    private String notice_Content;
    private Timestamp created_Date;
    private String created_Id;
    private Timestamp updated_Date;
    private String updated_Id;

    public Long getNoticeId() {
        return notice_Id;
    }

    public void setNoticeId(Long noticeId) {
        this.notice_Id = noticeId;
    }

    public Long getUserId() {
        return user_Id;
    }

    public void setUserId(Long userId) {
        this.user_Id = userId;
    }

    public String getNoticeTitle() {
        return notice_Title;
    }

    public void setNoticeTitle(String noticeTitle) {
        this.notice_Title = noticeTitle;
    }

    public String getNoticeContent() {
        return notice_Content;
    }

    public void setNoticeContent(String noticeContent) {
        this.notice_Content = noticeContent;
    }

    public Timestamp getCreatedDate() {
        return created_Date;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.created_Date = createdDate;
    }

    public String getCreatedId() {
        return created_Id;
    }

    public void setCreatedId(String createdId) {
        this.created_Id = createdId;
    }

    public Timestamp getUpdatedDate() {
        return updated_Date;
    }

    public void setUpdatedDate(Timestamp updatedDate) {
        this.updated_Date = updatedDate;
    }

    public String getUpdatedId() {
        return updated_Id;
    }

    public void setUpdatedId(String updatedId) {
        this.updated_Id = updatedId;
    }
}

