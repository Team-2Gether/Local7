package com.twogether.local7.like.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeVO {

    private Long likeId;
    private Long userId;
    private Long postId;
    private LocalDateTime likeDate;

}