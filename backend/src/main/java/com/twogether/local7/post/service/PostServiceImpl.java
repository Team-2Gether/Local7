package com.twogether.local7.post.service;

import com.twogether.local7.post.dao.PostDAO;
import com.twogether.local7.post.vo.ImageVO;
import com.twogether.local7.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostDAO postDAO;

    @Autowired
    private ImageService imageService;

    @Override
    public List<PostVO> getAllPosts() {
        List<PostVO> posts = postDAO.getAllPosts();
        // 각 게시글에 대해 이미지 정보와 firstImageUrl 설정
        return posts.stream().map(post -> {
            List<ImageVO> images = imageService.getImagesByPostId(post.getPostId());
            post.setImages(images);
            // 첫 번째 이미지의 Base64 문자열을 firstImageUrl에 설정
            if (images != null && !images.isEmpty()) {
                post.setFirstImageUrl(images.get(0).getImageUrl()); // ImageVO의 imageUrl은 이제 Base64 문자열
            } else {
                post.setFirstImageUrl(null); // 이미지가 없는 경우
            }
            return post;
        }).collect(Collectors.toList());
    }

    @Override
    public List<PostVO> getAllPosts(String sortBy) {
        List<PostVO> posts = postDAO.getAllPostsSorted(sortBy);
        // 각 게시글에 대해 이미지 정보와 firstImageUrl 설정
        return posts.stream().map(post -> {
            List<ImageVO> images = imageService.getImagesByPostId(post.getPostId());
            post.setImages(images);
            // 첫 번째 이미지의 Base64 문자열을 firstImageUrl에 설정
            if (images != null && !images.isEmpty()) {
                post.setFirstImageUrl(images.get(0).getImageUrl()); // ImageVO의 imageUrl은 이제 Base64 문자열
            } else {
                post.setFirstImageUrl(null);
            }
            return post;
        }).collect(Collectors.toList());
    }

    @Override
    public PostVO getPostById(Long postId) {
        // 1. 게시글 기본 정보 조회
        PostVO post = postDAO.getPostById(postId);

        // 2. 게시글이 존재하면 이미지 정보도 함께 조회하여 설정
        if (post != null) {
            List<ImageVO> images = imageService.getImagesByPostId(postId);
            post.setImages(images);
            // 첫 번째 이미지의 Base64 문자열을 firstImageUrl에 설정
            if (images != null && !images.isEmpty()) {
                post.setFirstImageUrl(images.get(0).getImageUrl());
            } else {
                post.setFirstImageUrl(null); // 이미지가 없는 경우
            }
        }
        return post;
    }

    @Override
    @Transactional
    public void createPost(PostVO post, List<String> imageUrls) {
        System.out.println("PostServiceImpl: createPost called with post: " + post.getPostTitle());
        postDAO.insertPost(post);
        System.out.println("PostServiceImpl: Post inserted, assigned postId: " + post.getPostId());

        // imageUrls 리스트의 상태를 확인
        if (imageUrls == null) {
            System.out.println("PostServiceImpl: imageUrls list is null.");
        } else if (imageUrls.isEmpty()) {
            System.out.println("PostServiceImpl: imageUrls list is empty. No images to save.");
        } else {
            System.out.println("PostServiceImpl: imageUrls list contains " + imageUrls.size() + " images.");
            for (String imageUrl : imageUrls) {
                ImageVO image = new ImageVO();
                image.setPostId(post.getPostId());
                image.setImageUrl(imageUrl);
                image.setCreatedId(post.getCreatedId());
                image.setUpdatedId(post.getUpdatedId());

                System.out.println("PostServiceImpl: Attempting to save image for postId: " + image.getPostId() + ", image URL (first 50 chars): " + imageUrl.substring(0, Math.min(imageUrl.length(), 50)) + "...");
                imageService.saveImage(image);
                System.out.println("PostServiceImpl: Image saved successfully for postId: " + image.getPostId());
            }
        }
    }

    @Override
    @Transactional
    public boolean updatePost(PostVO post, List<String> imageUrls, Long currentUserId) {

        // 1. 게시글 존재 여부 및 작성자 일치 여부 확인
        PostVO existingPost = postDAO.getPostById(post.getPostId());

        if (existingPost == null) {
            // 게시글이 존재하지 않으면 false 반환
            return false;
        }

        // 게시글이 없거나 현재 사용자가 작성자가 아니면 false 반환
        if (!existingPost.getUserId().equals(currentUserId) && currentUserId != 1L) {
            return false;
        }

        // 2. 게시글 업데이트 (DAO에서 userId 조건 추가)
        post.setUserId(currentUserId);
        postDAO.updatePost(post);

        // 3. 기존 이미지 삭제 (전체 삭제 후 재삽입 방식)
        imageService.deleteImagesByPostId(post.getPostId());

        // 4. 새로운 이미지 정보 저장
        if (imageUrls != null && !imageUrls.isEmpty()) {

            for (String imageUrl : imageUrls) {
                ImageVO image = new ImageVO();
                image.setPostId(post.getPostId());
                image.setImageUrl(imageUrl);
                image.setCreatedId(post.getUpdatedId());
                image.setUpdatedId(post.getUpdatedId());

                imageService.saveImage(image);
            }

        }
        return true;
    }

    @Override
    public void deletePost(Long postId, Long userId) {
        postDAO.deletePost(postId, userId);
    }
}