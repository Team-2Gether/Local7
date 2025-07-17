package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.VoteDAO;
import com.twogether.local7.vote.vo.VoteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VoteServiceImpl implements VoteService{
    //공통
    @Autowired
    private VoteDAO voteDAO;
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
