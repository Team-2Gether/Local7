package com.twogether.local7.follow.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class FollowVO {
    private int followerId;
    private int followingId;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;

    // 조인된 사용자 정보를 위한 필드 추가
    private String followerUserName;
    private String followerUserNickname;
    private String followerUserLoginId; // 추가
    private String followerUserProfileImageUrl; // 추가

    private String followingUserName;
    private String followingUserNickname;
    private String followingUserLoginId; // 추가
    private String followingUserProfileImageUrl; // 추가
}