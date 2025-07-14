package com.twogether.local7.like.dao;

import com.twogether.local7.like.vo.LikeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LikeDAO {

    // 좋아요 추가
    void insertLike(LikeVO likeVO);

    // 좋아요 취소 (삭제)
    void deleteLike(@Param("userId") Long userId, @Param("postId") Long postId);

    // 특정 사용자가 특정 게시글에 좋아요를 눌렀는지 확인
    int checkLikeStatus(@Param("userId") Long userId, @Param("postId") Long postId);

    // 특정 게시글의 좋아요 개수 조회
    int countLikesByPostId(Long postId);

}