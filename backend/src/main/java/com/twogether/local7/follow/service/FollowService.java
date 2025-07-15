package com.twogether.local7.follow.service;

import com.twogether.local7.follow.vo.FollowVO;
import java.util.List;

public interface FollowService {
    // 팔로우/언팔로우 토글 (이미 팔로우 중이면 언팔로우, 아니면 팔로우)
    boolean toggleFollow(FollowVO followVO);

    // 팔로우 상태 확인
    boolean isFollowing(FollowVO followVO);

    // 특정 사용자의 팔로워 목록 조회
    List<FollowVO> getFollowers(int followingId);

    // 특정 사용자의 팔로잉 목록 조회
    List<FollowVO> getFollowings(int followerId);

    // 특정 사용자의 팔로워 수 조회
    int getFollowerCount(int userId);

    // 특정 사용자의 팔로잉 수 조회
    int getFollowingCount(int userId);
}