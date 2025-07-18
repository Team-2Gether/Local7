package com.twogether.local7.user.dto;

import lombok.Data;

@Data
public class UserProfileImageUpdateRequest {
    private Long userId;
    private String userProfileImageUrl;
}