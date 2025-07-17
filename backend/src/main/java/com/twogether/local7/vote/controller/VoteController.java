package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.VoteService;
import com.twogether.local7.vote.service.VotePostService;
import com.twogether.local7.vote.vo.VoteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vote") // 공통 prefix
public class VoteController {

    //지역 
    @Autowired
    private VoteService voteService;

    @GetMapping("/regions")
    public List<VoteVO> getRegions() {
        return voteService.getAllRegions();
    }

    //게시글
    @Autowired
    private VotePostService votePostService;

    @GetMapping("/posts")
    public List<VoteVO> getPosts() {
        return votePostService.getAllPosts();
    }
}



