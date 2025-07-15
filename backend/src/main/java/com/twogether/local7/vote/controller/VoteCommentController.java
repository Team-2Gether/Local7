package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.VoteCommentService;
import com.twogether.local7.vote.vo.VoteCommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class VoteCommentController {

    @Autowired
    private VoteCommentService voteCommentService;

    @GetMapping
    public List<VoteCommentVO> getComments() {
        return voteCommentService.getAllComments();
    }

    @PostMapping("/comments")
    public void postComment(@RequestBody VoteCommentVO comment) {
        voteCommentService.insertComment(comment);
    }
}
