package com.twogether.local7.user.vo;

import lombok.Data;

import java.sql.Timestamp; // Timestamp import 추가

@Data
public class UserVO {
    private Long userId;
    private String userLoginId;
    private String userEmail;
    private String userPassword; // IMPORTANT: Should be hashed in a real application
    private String userName; // userUsername -> userName으로 변경
    private String userNickname;
    private String userProfileImageUrl; // 추가
    private String userBio; // 추가
    private Long ruleId; // TB_USER 테이블의 RULE_ID 컬럼과 매핑
    private String ruleName; // TB_RULE 테이블의 RULE_NAME 컬럼과 매핑
    private Timestamp createDate; // 추가
    private String createdId; // 추가
    private Timestamp updatedDate; // 추가
    private String updatedId; // 추가
}