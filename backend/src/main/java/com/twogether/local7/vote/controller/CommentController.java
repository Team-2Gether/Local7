package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.CommentService;
import com.twogether.local7.vote.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<CommentVO> getComments() {
        return commentService.getAllComments();
    }

    @PostMapping
    public void postComment(@RequestBody CommentVO comment) {
        commentService.insertComment(comment);
    }
}
