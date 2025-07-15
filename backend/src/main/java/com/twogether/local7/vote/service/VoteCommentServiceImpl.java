package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.VoteCommentDAO;
import com.twogether.local7.vote.vo.VoteCommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteCommentServiceImpl implements VoteCommentService {

    @Autowired
    private VoteCommentDAO voteCommentDAO;

    @Override
    public List<VoteCommentVO> getAllComments() {
        return voteCommentDAO.getAllComments();
    }

    @Override
    public void insertComment(VoteCommentVO comment) {
        voteCommentDAO.insertComment(comment);
    }
}
