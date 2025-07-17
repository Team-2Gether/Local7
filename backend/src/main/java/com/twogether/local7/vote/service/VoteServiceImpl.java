package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.VoteDAO;
import com.twogether.local7.vote.vo.VoteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VoteServiceImpl implements VoteService{
    //공통
    @Autowired
    private VoteDAO voteDAO;

    //투표
    @Override
    @Transactional
    public void vote(Long userId, Long regionId) {
        // view_count 증가
        voteDAO.increaseViewCount(regionId);

        // has_voted = 'Y' 로 변경
        voteDAO.updateHasVoted(userId);
    }

    @Override
    public void increaseViewCount(Long regionId) {
        voteDAO.increaseViewCount(regionId);
    }

    @Override
    public void updateHasVoted(Long userId) {
        voteDAO.updateHasVoted(userId);
    }

    @Override
    public List<VoteVO> getUserById(Long userId) {
        return voteDAO.getUserById(userId);
    }

    //지역
    @Override
    public List<VoteVO> getAllRegions() {
        return voteDAO.getAllRegions();
    }
    //게시글
    @Override
    public List<VoteVO> getAllPosts() {
        return voteDAO.getAllPosts();
    }
}
