package com.twogether.local7.vote.service;

import com.twogether.local7.vote.vo.VoteCommentVO;

import java.util.List;

public interface VoteCommentService {
    List<VoteCommentVO> getAllComments();
    void insertComment(VoteCommentVO comment);
}
