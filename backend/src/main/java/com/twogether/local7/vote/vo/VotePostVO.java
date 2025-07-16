package com.twogether.local7.vote.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class VotePostVO {
    private Long postId;
    private Long userId;
    private Long restaurantId;
    private String postTitle;
    private String postContent;
    private String locationTag;
    private LocalDateTime createdDate;
}
