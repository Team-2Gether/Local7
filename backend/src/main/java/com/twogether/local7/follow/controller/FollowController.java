package com.twogether.local7.follow.controller;

import com.twogether.local7.follow.service.FollowService;
import com.twogether.local7.follow.vo.FollowVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    /**
     * 팔로우/언팔로우 토글 API
     * POST /api/follows/toggle
     * 요청 본문: { "followerId": 1, "followingId": 2, "createdId": "user1", "updatedId": "user1" }
     * 응답: 팔로우 상태 변경 성공 여부
     */
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFollow(@RequestBody FollowVO followVO) {
        Map<String, Object> response = new HashMap<>();
        // 실제 애플리케이션에서는 현재 로그인한 사용자 ID를 followerId로 설정해야 합니다.
        // 여기서는 임시로 요청 본문에서 받은 값을 사용합니다.
        // followVO.setFollowerId(현재_로그인한_사용자_ID);

        boolean success = followService.toggleFollow(followVO);
        if (success) {
            boolean isFollowing = followService.isFollowing(followVO);
            response.put("success", true);
            response.put("isFollowing", isFollowing);
            response.put("message", isFollowing ? "팔로우 성공" : "언팔로우 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("success", false);
            response.put("message", "팔로우/언팔로우 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 팔로우 상태 확인 API
     * GET /api/follows/status?followerId={followerId}&followingId={followingId}
     * 응답: 팔로우 중인지 여부
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getFollowStatus(@RequestParam int followerId, @RequestParam int followingId) {
        Map<String, Object> response = new HashMap<>();
        FollowVO followVO = new FollowVO();
        followVO.setFollowerId(followerId);
        followVO.setFollowingId(followingId);

        boolean isFollowing = followService.isFollowing(followVO);
        response.put("isFollowing", isFollowing);
        response.put("message", isFollowing ? "팔로우 중입니다." : "팔로우 중이 아닙니다.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 특정 사용자의 팔로워 목록 조회 API
     * GET /api/follows/followers/{userId}
     * 응답: 팔로워 목록
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowVO>> getFollowers(@PathVariable int userId) {
        List<FollowVO> followers = followService.getFollowers(userId);
        return new ResponseEntity<>(followers, HttpStatus.OK);
    }

    /**
     * 특정 사용자의 팔로잉 목록 조회 API
     * GET /api/follows/followings/{userId}
     * 응답: 팔로잉 목록
     */
    @GetMapping("/followings/{userId}")
    public ResponseEntity<List<FollowVO>> getFollowings(@PathVariable int userId) {
        List<FollowVO> followings = followService.getFollowings(userId);
        return new ResponseEntity<>(followings, HttpStatus.OK);
    }

    /**
     * 특정 사용자의 팔로워 수 조회 API
     * GET /api/follows/followers/count/{userId}
     * 응답: 팔로워 수
     */
    @GetMapping("/followers/count/{userId}")
    public ResponseEntity<Map<String, Integer>> getFollowerCount(@PathVariable int userId) {
        Map<String, Integer> response = new HashMap<>();
        int count = followService.getFollowerCount(userId);
        response.put("followerCount", count);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 특정 사용자의 팔로잉 수 조회 API
     * GET /api/follows/followings/count/{userId}
     * 응답: 팔로잉 수
     */
    @GetMapping("/followings/count/{userId}")
    public ResponseEntity<Map<String, Integer>> getFollowingCount(@PathVariable int userId) {
        Map<String, Integer> response = new HashMap<>();
        int count = followService.getFollowingCount(userId);
        response.put("followingCount", count);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}