package com.twogether.local7.comment.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentVO {

    private Long commentId;
    private Long postId;
    private Long userId;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private String userNickname;
    private String userProfImgUrl;
    private String loginId; // loginId 필드 추가됨

    private int likeCount;

    private boolean likedByCurrentUser;

}