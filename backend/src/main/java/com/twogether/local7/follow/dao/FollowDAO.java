package com.twogether.local7.follow.dao;

import com.twogether.local7.follow.vo.FollowVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FollowDAO {
    // 팔로우 추가
    int insertFollow(FollowVO followVO);

    // 팔로우 삭제
    int deleteFollow(FollowVO followVO);

    // 팔로우 상태 확인 (이미 팔로우 중인지)
    int countFollow(FollowVO followVO);

    // 특정 사용자를 팔로우하는 사람들 목록 (팔로워 목록)
    List<FollowVO> selectFollowers(int followingId);

    // 특정 사용자가 팔로우하는 사람들 목록 (팔로잉 목록)
    List<FollowVO> selectFollowings(int followerId);

    // 특정 사용자의 팔로워 수 조회
    int countFollowers(int userId);

    // 특정 사용자의 팔로잉 수 조회
    int countFollowings(int userId);
}