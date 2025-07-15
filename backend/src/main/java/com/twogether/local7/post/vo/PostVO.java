package com.twogether.local7.post.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostVO {

    private Long postId;
    private Long userId;
    private Long restaurantId;
    private String postTitle;
    private String postContent;
    private String locationTag;
    private LocalDateTime createdDate;
    private String createdId;
    private LocalDateTime updatedDate;
    private String updatedId;

    private String userNickname;
    private String firstImageUrl;

    private List<ImageVO> images;

    private int likeCount;
    private boolean isLiked;

}

