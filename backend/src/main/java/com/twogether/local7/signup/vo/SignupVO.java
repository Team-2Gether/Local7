package com.twogether.local7.signup.vo;

import lombok.Data;

@Data
public class SignupVO {
    private String userLoginId; // USER_LOGIN_ID VARCHAR(50) NOT NULL UNIQUE
    private String userUsername; // USER_USERNAME VARCHAR2(50) NOT NULL UNIQUE
    private String userPassword; // USER_PASSWORD VARCHAR2(255) NOT NULL
    private String userEmail; // USER_EMAIL VARCHAR2(100) UNIQUE
    private String userNickname; // USER_NICKNAME VARCHAR2(50) NOT NULL UNIQUE
    private String userProfileImageUrl; // USER_PROFILE_IMAGE_URL VARCHAR2(500)
    private String userBio; // USER_BIO VARCHAR2(200)
}