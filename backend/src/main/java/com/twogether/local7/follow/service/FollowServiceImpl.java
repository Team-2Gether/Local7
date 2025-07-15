package com.twogether.local7.follow.service;

import com.twogether.local7.follow.dao.FollowDAO;
import com.twogether.local7.follow.vo.FollowVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService {

    private final FollowDAO followDAO;

    @Autowired
    public FollowServiceImpl(FollowDAO followDAO) {
        this.followDAO = followDAO;
    }

    @Override
    @Transactional
    public boolean toggleFollow(FollowVO followVO) {
        // 이미 팔로우 중인지 확인
        if (followDAO.countFollow(followVO) > 0) {
            // 이미 팔로우 중이면 언팔로우 (삭제)
            int result = followDAO.deleteFollow(followVO);
            return result > 0;
        } else {
            // 팔로우 중이 아니면 팔로우 (추가)
            int result = followDAO.insertFollow(followVO);
            return result > 0;
        }
    }

    @Override
    public boolean isFollowing(FollowVO followVO) {
        return followDAO.countFollow(followVO) > 0;
    }

    @Override
    public List<FollowVO> getFollowers(int followingId) {
        return followDAO.selectFollowers(followingId);
    }

    @Override
    public List<FollowVO> getFollowings(int followerId) {
        return followDAO.selectFollowings(followerId);
    }

    @Override
    public int getFollowerCount(int userId) {
        return followDAO.countFollowers(userId);
    }

    @Override
    public int getFollowingCount(int userId) {
        return followDAO.countFollowings(userId);
    }
}