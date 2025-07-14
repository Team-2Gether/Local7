package com.twogether.local7.like.service;

public interface LikeService {

    // 좋아요/좋아요 취소 토글
    boolean toggleLike(Long userId, Long postId);

    // 특정 게시글의 좋아요 개수 조회
    int getLikeCount(Long postId);

    // 특정 사용자가 특정 게시글에 좋아요를 눌렀는지 여부 확인
    boolean isLikedByUser(Long userId, Long postId);

}