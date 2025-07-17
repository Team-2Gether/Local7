package com.twogether.local7.post.service;

import com.twogether.local7.post.vo.ImageVO;

import java.util.List;

public interface ImageService {

    // 단일 이미지 저장
    void saveImage(ImageVO image);

    // 게시글 ID로 이미지 조회
    List<ImageVO> getImagesByPostId(Long postId);

    // 게시글 ID로 이미지 삭제
    void deleteImagesByPostId(Long postId);

}