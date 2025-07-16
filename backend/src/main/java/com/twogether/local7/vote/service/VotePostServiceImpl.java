package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.VotePostDAO;
import com.twogether.local7.vote.vo.VotePostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VotePostServiceImpl implements VotePostService {

    @Autowired
    private VotePostDAO votePostDAO;

    @Override
    public List<VotePostVO> getAllPosts() {
        return votePostDAO.getAllPosts();
    }
}
