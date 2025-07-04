// src/main/java/com/twogether/sra/user/vo/UserVO.java
package com.twogether.sra.user.vo;

import lombok.Data;

@Data
public class UserVO {
    private Long userId; // Assuming you might need this ID after login
    private String userLoginId;
    private String userEmail;
    private String userPassword;
    private String userUsername; // For displaying username after login
    private String userNickname; // For displaying nickname after login
}