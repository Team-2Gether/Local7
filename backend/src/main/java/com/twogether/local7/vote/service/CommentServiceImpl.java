package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.CommentDAO;
import com.twogether.local7.vote.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentDAO commentDAO;

    @Override
    public List<CommentVO> getAllComments() {
        return commentDAO.getAllComments();
    }

    @Override
    public void insertComment(CommentVO comment) {
        commentDAO.insertComment(comment);
    }
}
