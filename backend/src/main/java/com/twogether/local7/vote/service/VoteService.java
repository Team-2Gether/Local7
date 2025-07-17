package com.twogether.local7.vote.service;

import com.twogether.local7.vote.vo.VoteVO;

import java.util.List;

public interface VoteService {
    void vote(Long userId, Long regionId);
    void increaseViewCount(Long regionId);
    void updateHasVoted(Long userId);
    List<VoteVO> getAllVotes();

    List<VoteVO> getUserById(Long userId);

    List<VoteVO> getAllRegions();

    List<VoteVO> getAllPosts();

}
