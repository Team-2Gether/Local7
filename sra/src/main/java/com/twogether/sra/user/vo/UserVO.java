// src/main/java/com/twogether/sra/user/vo/UserVO.java
package com.twogether.sra.user.vo;

import lombok.Data;

@Data
public class UserVO {
    private Long userId;
    private String userLoginId;
    private String userEmail;
    private String userPassword; // IMPORTANT: Should be hashed in a real application
    private String userUsername;
    private String userNickname;
    private String userProfileImageUrl;
    private String userBio;
    private Long ruleId; // TB_USER 테이블의 RULE_ID 컬럼과 매핑
    private String ruleName; // TB_RULE 테이블의 RULE_NAME 컬럼과 매핑
}