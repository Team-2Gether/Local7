package com.twogether.local7.post.dao;

import com.twogether.local7.post.vo.PostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostDAO {

    // 모든 게시글 조회
    List<PostVO> getAllPosts();

    // 특정 게시글 ID로 조회
    PostVO getPostById(@Param("postId") Long postId);

    // 게시글 생성
    void insertPost(PostVO post);

    // 게시글 업데이트
    void updatePost(PostVO post);

    // 게시글 삭제
    // userId 파라미터 추가 및 @Param으로 이름 명시
    void deletePost(@Param("postId") Long postId, @Param("userId") Long userId);

}

