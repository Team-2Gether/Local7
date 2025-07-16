package com.twogether.local7.post.service;

import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.post.vo.ImageVO;

import java.util.List;

public interface PostService {

    List<PostVO> getAllPosts();

    // 게시글 필터링을 위한 오버로드된 메서드 추가
    List<PostVO> getAllPosts(String sortBy);

    PostVO getPostById(Long postId);

    // 게시글 생성 메서드: PostVO와 이미지 URL 목록을 받음
    void createPost(PostVO post, List<String> imageUrls);

    // 게시글 업데이트 메서드 수정: PostVO와 이미지 URL 목록을 받음
    boolean updatePost(PostVO post, List<String> imageUrls, Long currentUserId);

    // 게시글 삭제
    void deletePost(Long postId, Long userId);

}