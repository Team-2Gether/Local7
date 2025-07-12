package com.twogether.local7.post.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageVO {
    private Long imageId;
    private Long postId;
    private String imageUrl;
    private LocalDateTime createdDate;
    private String createdId;
    private LocalDateTime updatedDate;
    private String updatedId;
}