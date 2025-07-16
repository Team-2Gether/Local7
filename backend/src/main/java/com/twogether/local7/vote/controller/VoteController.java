package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.VoteRegionService;
import com.twogether.local7.vote.service.VotePostService;
import com.twogether.local7.vote.vo.VotePostVO;
import com.twogether.local7.vote.vo.VoteRegionVO;
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
    private VoteRegionService voteRegionService;
    //게시글
    @Autowired
    private VotePostService votePostService;

    //지역
    @GetMapping("/regions")
    public List<VoteRegionVO> getRegions() {
        return voteRegionService.getAllRegions();
    }
    //게시글
    @GetMapping("/posts")
    public List<VotePostVO> getPosts() {
        return votePostService.getAllPosts();
    }
}



