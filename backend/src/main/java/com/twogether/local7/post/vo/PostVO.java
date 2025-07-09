package com.twogether.local7.post.vo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private String isNotice;
    private LocalDateTime createdDate;
    private String createdId;
    private LocalDateTime updatedDate;
    private String updatedId;

}

