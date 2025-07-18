package com.twogether.local7.user.vo;

import lombok.Data;

import java.sql.Timestamp; // Timestamp import 추가

@Data
public class UserVO {
    private Long userId;
    private String userLoginId;
    private String userEmail;
    private String userPassword; // IMPORTANT: Should be hashed in a real application
    private String userName;
    private String userNickname;
    private String userProfileImageUrl; // CLOB 데이터 타입 (Base64 인코딩된 이미지 문자열 저장)
    private String userBio;
    private Long ruleId; // 1은 admin 2는 user
    private String ruleName; // TB_RULE 테이블의 RULE_NAME 컬럼과 매핑
    private Timestamp createDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;

    public String getUserPassword() {
        return userPassword;
    }
}