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

        // voted_region 업데이트
        voteDAO.updateVotedRegion(userId, regionId);
    }

    @Override
    public void increaseViewCount(Long regionId) {
        voteDAO.increaseViewCount(regionId);
    }

    @Override
    public void updateHasVoted(Long userId) {
        voteDAO.updateHasVoted(userId);
    }

    // voted_region 업데이트 메서드 구현
    @Override
    public void updateVotedRegion(Long userId, Long regionId) {
        voteDAO.updateVotedRegion(userId, regionId);
    }

    @Override
    public List<VoteVO> getUserById(Long userId) {
        return voteDAO.getUserById(userId);
    }

    //투표 수
    @Override
    public List<VoteVO> getAllViewCount(){
        return voteDAO.getAllViewCount();
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

    // 각 지역별 투표한 사용자 수를 조회하는 메서드 구현
    @Override
    public List<VoteVO> getVotedRegionCounts() {
        return voteDAO.getVotedRegionCounts();
    }
}