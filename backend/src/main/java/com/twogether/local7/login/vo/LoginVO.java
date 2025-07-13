package com.twogether.local7.login.vo;

import lombok.Data;

import java.sql.Timestamp; // Timestamp import 추가

@Data
public class LoginVO {
    private Long userId;
    private String userLoginId;
    private String userEmail;
    private String userPassword; // IMPORTANT: Should be hashed in a real application
    private String userName;
    private String userNickname;
    private String userProfileImageUrl;
    private String userBio;
    private Long ruleId; // TB_USER 테이블의 RULE_ID 컬럼과 매핑
    private String ruleName; // TB_RULE 테이블의 RULE_NAME 컬럼과 매핑
    private Timestamp createDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
}