package com.twogether.local7.vote.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
public class VoteCommentVO {
    private Long commentId;
    private Long postId;
    private Long userId;
    private String content;
    private Long createdId;
    private LocalDateTime createdData;
}
