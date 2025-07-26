package com.twogether.local7.vote.service;

import com.twogether.local7.vote.vo.VoteVO;

import java.util.List;

public interface VoteService {
    //투표여부 확인
    void vote(Long userId, Long regionId);

    //해당 지역 view_count 증가
    void increaseViewCount(Long regionId);

    //사용자 has_voted 상태 업데이트
    void updateHasVoted(Long userId);

    //사용자 voted_region 상태 업데이트
    void updateVotedRegion(Long userId, Long regionId);

    List<VoteVO> getAllViewCount();

    List<VoteVO> getUserById(Long userId);

    List<VoteVO> getAllRegions();

    List<VoteVO> getAllPosts();

}