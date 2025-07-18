package com.twogether.local7.post.service;

import com.twogether.local7.post.dao.ImageDAO;
import com.twogether.local7.post.vo.ImageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageDAO imageDAO;

    @Override
    @Transactional
    public void saveImage(ImageVO image) {
        System.out.println("ImageServiceImpl: saveImage called. ImageVO postId: " + image.getPostId() + ", imageUrl length: " + (image.getImageUrl() != null ? image.getImageUrl().length() : "null"));
        try {
            imageDAO.insertImage(image);
            System.out.println("ImageServiceImpl: imageDAO.insertImage successful.");
        } catch (Exception e) {
            System.err.println("ImageServiceImpl: Error inserting image: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 출력
            throw new RuntimeException("Failed to save image", e); // 예외를 다시 던져 트랜잭션 롤백 유도
        }
    }

    @Override
    public List<ImageVO> getImagesByPostId(Long postId) {
        return imageDAO.getImagesByPostId(postId);
    }

    @Override
    @Transactional
    public void deleteImagesByPostId(Long postId) {
        imageDAO.deleteImagesByPostId(postId);
    }

}