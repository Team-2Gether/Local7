package com.twogether.local7.vote.service;

import com.twogether.local7.vote.vo.CommentVO;

import java.util.List;

public interface CommentService {
    List<CommentVO> getAllComments();
    void insertComment(CommentVO comment);
}
