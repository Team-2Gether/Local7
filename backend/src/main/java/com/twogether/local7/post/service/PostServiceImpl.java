package com.twogether.local7.post.service;

import com.twogether.local7.post.dao.PostDAO;
import com.twogether.local7.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostDAO postDAO;

    @Override
    public List<PostVO> getAllPosts() {
        return postDAO.getAllPosts();
    }

    @Override
    public PostVO getPostById(Long postId) {
        return postDAO.getPostById(postId);
    }

    @Override
    public void createPost(PostVO post) {
        postDAO.insertPost(post);
    }

    @Override
    public void updatePost(PostVO post) {
        postDAO.updatePost(post);
    }

    @Override
    public void deletePost(Long postId) {
        postDAO.deletePost(postId);
    }

}
