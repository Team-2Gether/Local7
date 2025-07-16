package com.twogether.local7.post.service;

import com.twogether.local7.post.dao.PostDAO;
import com.twogether.local7.post.vo.ImageVO;
import com.twogether.local7.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostDAO postDAO;

    @Autowired
    private ImageService imageService;

    @Override
    public List<PostVO> getAllPosts() {
        return postDAO.getAllPosts();
    }

    @Override
    public List<PostVO> getAllPosts(String sortBy) { // <-- 이 메서드 추가
        // 정렬 기준에 따라 DAO 메서드 호출
        // PostDAO에 getAllPostsSorted(String sortBy) 메서드가 있다고 가정합니다.
        return postDAO.getAllPostsSorted(sortBy);
    }

    @Override
    public PostVO getPostById(Long postId) {
        return postDAO.getPostById(postId);
    }

    @Override
    @Transactional
    public void createPost(PostVO post, List<String> imageUrls) {

        postDAO.insertPost(post);

        if (imageUrls != null && !imageUrls.isEmpty()) {

            List<ImageVO> imagesToSave = new ArrayList<>();

            for (String imageUrl : imageUrls) {
                ImageVO image = new ImageVO();
                image.setPostId(post.getPostId());
                image.setImageUrl(imageUrl);
                image.setCreatedId(post.getCreatedId());
                image.setUpdatedId(post.getUpdatedId());
                imagesToSave.add(image);
            }

            imageService.saveImages(imagesToSave);
        }
    }

    @Override
    @Transactional
    public boolean updatePost(PostVO post, List<String> imageUrls, Long currentUserId) {

        // 1. 게시글 존재 여부 및 작성자 일치 여부 확인
        PostVO existingPost = postDAO.getPostById(post.getPostId());

        // 게시글이 없거나 현재 사용자가 작성자가 아니면 false 반환
        if (existingPost == null || !existingPost.getUserId().equals(currentUserId)) {
            return false;
        }

        // 2. 게시글 업데이트 (DAO에서 userId 조건 추가)
        post.setUserId(currentUserId);

        postDAO.updatePost(post);


        // 3. 기존 이미지 삭제 (전체 삭제 후 재삽입 방식)
        imageService.deleteImagesByPostId(post.getPostId());

        // 4. 새로운 이미지 정보 저장
        if (imageUrls != null && !imageUrls.isEmpty()) {
            List<ImageVO> imagesToSave = new ArrayList<>();
            for (String imageUrl : imageUrls) {
                ImageVO image = new ImageVO();
                image.setPostId(post.getPostId());
                image.setImageUrl(imageUrl);
                image.setCreatedId(post.getUpdatedId());
                image.setUpdatedId(post.getUpdatedId());
                imagesToSave.add(image);
            }
            imageService.saveImages(imagesToSave);
        }
        return true;
    }

    @Override
    // userId 파라미터 추가 및 DAO 호출 시 전달
    public void deletePost(Long postId, Long userId) {
        postDAO.deletePost(postId, userId);
    }
}