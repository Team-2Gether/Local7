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
    private String postTitle;
    private String postContent;
    private String createdDate;
    private String locationTag;
    private Long userCount;
    private String userName;
    private String userProfImgUrl;
}
