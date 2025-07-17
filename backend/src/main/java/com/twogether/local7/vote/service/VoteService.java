package com.twogether.local7.vote.service;

import com.twogether.local7.vote.vo.VoteVO;

import java.util.List;

public interface VoteService {
    List<VoteVO> getAllRegions();

    List<VoteVO> getAllPosts();

}
