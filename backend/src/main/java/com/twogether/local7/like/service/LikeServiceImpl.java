package com.twogether.local7.like.service;

import com.twogether.local7.like.dao.LikeDAO;
import com.twogether.local7.like.vo.LikeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeDAO likeDAO;

    @Override
    @Transactional
    public boolean toggleLike(Long userId, Long postId) {

        // 사용자가 이미 좋아요를 눌렀는지 확인
        if (likeDAO.checkLikeStatus(userId, postId) > 0) {
            // 이미 눌렀다면 좋아요 취소
            likeDAO.deleteLike(userId, postId);
            return false; // 좋아요 취소됨
        } else {
            // 누르지 않았다면 좋아요 추가
            LikeVO likeVO = new LikeVO();
            likeVO.setUserId(userId);
            likeVO.setPostId(postId);
            likeDAO.insertLike(likeVO);
            return true; // 좋아요 추가됨
        }
    }

    @Override
    public int getLikeCount(Long postId) {
        return likeDAO.countLikesByPostId(postId);
    }

    @Override
    public boolean isLikedByUser(Long userId, Long postId) {
        return likeDAO.checkLikeStatus(userId, postId) > 0;
    }
}