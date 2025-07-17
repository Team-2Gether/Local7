package com.twogether.local7.user.vo;

import com.twogether.local7.post.vo.ImageVO;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PostDetailVO {
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

    // 현재
    private List<ImageVO> images;

}