package com.twogether.local7.user.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class PostVO {
    private Long postId;
    private Long userId;
    private String userLoginId; // 게시글 작성자의 로그인 ID를 위한 필드 추가
    private Long restaurantId;
    private String postTitle;
    private String postContent;
    private String locationTag;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
    private int commentCount; // COMMENT_COUNT 필드 추가
}