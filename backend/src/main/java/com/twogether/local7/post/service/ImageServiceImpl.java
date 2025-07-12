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
        imageDAO.insertImage(image);
    }

    @Override
    @Transactional
    public void saveImages(List<ImageVO> images) {
        if (images != null && !images.isEmpty()) {
            imageDAO.insertImages(images);
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