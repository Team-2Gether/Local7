package com.twogether.local7.vote.controller;

import com.twogether.local7.vote.service.VoteService;
import com.twogether.local7.vote.vo.VoteVO;
import jakarta.servlet.http.HttpSession;
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

    //투표 요청 처리
    @PostMapping("/votes")
    public ResponseEntity<String> vote(@RequestBody VoteVO voteVO, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        voteService.vote(userId, voteVO.getRegionId());
        return ResponseEntity.ok("투표 완료");
    }

    //유저의 투표 여부 조회
    @GetMapping("/userId")
    public List<VoteVO> getUserById(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("로그인 필요");
        }
        System.out.println(">>> getUserById 호출됨. userId = " + userId);
        return voteService.getUserById(userId);
    }
    //투표 수 리스트 조회
    @GetMapping("/results")
    public List<VoteVO> getViewCount(){
        return voteService.getAllViewCount();
    }
    //지역 리스트 조회
    @GetMapping("/regions")
    public List<VoteVO> getRegions() {
        return voteService.getAllRegions();
    }
    //게시글 리스트 조회
    @GetMapping("/posts")
    public List<VoteVO> getPosts() {
        return voteService.getAllPosts();
    }
}



