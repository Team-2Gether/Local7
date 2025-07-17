package com.twogether.local7.vote.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoteVO {

    //vote
    private Long userId;
    private Long viewCount;
    private String hasVoted; // "Y" or "N"

    //region
    private Long regionId;
    private String krName; //region_description쿼리 별칭

    //post
    private Long postId;
    private String postTitle;
    private String postContent;
    private String createdDate;
    private String locationTag;
    private Long userCount;
    private String userNickname;
    private String userProfImgUrl;
    private String imageUrl;
}
