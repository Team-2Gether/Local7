package com.twogether.local7.signup.vo;

import lombok.Data;

@Data
public class SignupVO {
    private String userLoginId; // LOGIN_ID VARCHAR(50) NOT NULL UNIQUE
    private String userName; // USER_NAME VARCHAR2(50) NOT NULL
    private String userPassword; // USER_PASSWORD VARCHAR2(200)
    private String userEmail; // USER_EMAIL VARCHAR2(100) UNIQUE
    private String userNickname; // USER_NICKNAME VARCHAR2(50) NOT NULL UNIQUE
    private String userProfImgUrl; // USER_PROF_IMG_URL CLOB
    private String userBio; // USER_BIO VARCHAR2(200)
    private String createdId; // CREATED_ID VARCHAR2(100) - 추가된 필드
    private int ruleId; // RULE_ID NUMBER NOT NULL - 추가된 필드
}