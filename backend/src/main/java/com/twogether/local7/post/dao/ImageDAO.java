package com.twogether.local7.post.dao;

import com.twogether.local7.post.vo.ImageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ImageDAO {

    // 이미지 정보를 DB에 삽입 (단일 이미지)
    void insertImage(ImageVO image);

    // 특정 게시글 ID에 해당하는 이미지들 조회
    List<ImageVO> getImagesByPostId(@Param("postId") Long postId);

    // 특정 게시글 ID에 해당하는 모든 이미지 삭제
    void deleteImagesByPostId(@Param("postId") Long postId);

}