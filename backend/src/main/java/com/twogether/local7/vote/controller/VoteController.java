package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.VoteService;
import com.twogether.local7.vote.service.VoteService;
import com.twogether.local7.vote.vo.VoteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vote") // 공통 prefix
public class VoteController {

    //공통
    @Autowired
    private VoteService voteService;

    //투표
    @PostMapping("/votes")
    public ResponseEntity<String> vote(@RequestBody VoteVO voteVO) {
        voteService.vote(voteVO.getUserId(), voteVO.getRegionId());
        return ResponseEntity.ok("투표 완료");
    }

//     유저의 투표 여부(has_voted) 반환
    @GetMapping("/userId")
    public List<VoteVO> getUserById(@RequestParam Long userId) {
        System.out.println(">>> getUserById 호출됨. userId = " + userId);
        return voteService.getUserById(userId);
    }
//    @GetMapping("/votes")
//    public List<VoteVO> getVotes() {
//        return voteService.getAllVotes();
//    }
    //지역
    @GetMapping("/regions")
    public List<VoteVO> getRegions() {
        return voteService.getAllRegions();
    }
    //게시글
    @GetMapping("/posts")
    public List<VoteVO> getPosts() {
        return voteService.getAllPosts();
    }
}



