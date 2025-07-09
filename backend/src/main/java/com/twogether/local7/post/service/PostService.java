package com.twogether.local7.post.service;

import com.twogether.local7.post.vo.PostVO;

import java.util.List;

public interface PostService {

    List<PostVO> getAllPosts();

    PostVO getPostById(Long postId);

    void createPost(PostVO post);

    void updatePost(PostVO post);

    void deletePost(Long postId);

}
