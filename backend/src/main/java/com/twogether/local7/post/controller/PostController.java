package com.twogether.local7.post.controller;

import com.twogether.local7.like.service.LikeService;
import com.twogether.local7.post.service.PostService;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.service.ReportService;
import com.twogether.local7.report.vo.ReportVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private ReportService reportService;


    // 모든 게시글 조회 (GET /api/posts)
    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> getAllPosts(@RequestParam(required = false) String sortBy, HttpSession session) {

        List<PostVO> posts;

        if (sortBy != null && !sortBy.isEmpty()) {
            posts = postService.getAllPosts(sortBy);
        } else {
            posts = postService.getAllPosts();
        }

        Map<String, Object> response = new HashMap<>();
        Long currentUserId = (Long) session.getAttribute("userId");

        List<PostVO> postsWithLikeStatus = posts.stream().map(post -> {
            post.setLikeCount(likeService.getLikeCount(post.getPostId()));
            if (currentUserId != null) {
                post.setLiked(likeService.isLikedByUser(currentUserId, post.getPostId()));
            } else {
                post.setLiked(false);
            }
            return post;
        }).collect(Collectors.toList());

        response.put("status", "success");
        response.put("message", "모든 게시글을 성공적으로 조회했습니다.");
        response.put("data", postsWithLikeStatus);

        return ResponseEntity.ok(response);
    }

    // 특정 게시글 ID로 조회 (GET /api/posts/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable("id") Long postId, HttpSession session) {

        PostVO post = postService.getPostById(postId);
        Map<String, Object> response = new HashMap<>();

        if (post == null) {
            response.put("status", "error");
            response.put("message", "게시글을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        int likeCount = likeService.getLikeCount(postId);
        post.setLikeCount(likeCount);

        Long currentUserId = (Long) session.getAttribute("userId");
        boolean isLiked = false;

        if (currentUserId != null) {
            isLiked = likeService.isLikedByUser(currentUserId, postId);
        }

        post.setLiked(isLiked);

        response.put("status", "success");
        response.put("message", "게시글을 성공적으로 조회했습니다.");
        response.put("data", post);
        return ResponseEntity.ok(response);
    }

    // 게시글 생성 (POST /api/posts) - 이미지 파일 추가
    @PostMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> createPost(@RequestPart("post") PostVO post, @RequestParam(value = "images", required = false) List<String> images, HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Long currentUserId = (Long) session.getAttribute("userId");
        String currentUserLoginId = (String) session.getAttribute("userLoginId");

        if (currentUserId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            post.setUserId(currentUserId);
            post.setCreatedId(currentUserLoginId);
            post.setUpdatedId(currentUserLoginId);

            postService.createPost(post, images);

            response.put("status", "success");
            response.put("message", "게시글과 이미지가 성공적으로 생성되었습니다.");
            response.put("data", post);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "게시글 생성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시글 업데이트 (PUT /api/posts/{id}) - 이미지 파일 추가
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> updatePost(@PathVariable("id") Long postId, @RequestPart("post") PostVO post, @RequestParam(value = "images", required = false) List<String> images, HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Long currentUserId = (Long) session.getAttribute("userId");
        String currentUserLoginId = (String) session.getAttribute("userLoginId");

        if (currentUserId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        post.setPostId(postId);
        post.setUpdatedId(currentUserLoginId);

        try {
            boolean success = postService.updatePost(post, images, currentUserId);

            if (success) {
                response.put("status", "success");
                response.put("message", "게시글과 이미지가 성공적으로 업데이트되었습니다.");
                response.put("data", post);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "게시글을 찾을 수 없거나, 수정 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "게시글 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시글 삭제 (DELETE /api/posts/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable("id") Long postId, HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        PostVO existingPost = postService.getPostById(postId);
        if (existingPost == null) {
            response.put("status", "error");
            response.put("message", "게시글을 찾을 수 없어 삭제할 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (!existingPost.getUserId().equals(currentUserId) && currentUserId != 1L) {
            response.put("status", "error");
            response.put("message", "게시글을 삭제할 권한이 없습니다. 본인이 작성한 게시글 또는 관리자만 삭제할 수 있습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            postService.deletePost(postId, currentUserId);
            response.put("status", "success");
            response.put("message", "게시글이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "게시글 삭제 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 좋아요/좋아요 취소 토글 API (POST /api/posts/{postId}/like)
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long postId, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            boolean liked = likeService.toggleLike(userId, postId);
            int updatedLikeCount = likeService.getLikeCount(postId);

            response.put("status", "success");
            response.put("liked", liked);
            response.put("likeCount", updatedLikeCount);
            String message = liked ? "게시글에 좋아요를 눌렀습니다." : "게시글 좋아요를 취소했습니다.";
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "좋아요 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // **게시글 신고 API (POST /api/posts/{postId}/report)**
    @PostMapping("/{postId}/report")
    public ResponseEntity<Map<String, Object>> reportPost(@PathVariable Long postId, @RequestBody ReportVO reportVO, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long reporterId = (Long) session.getAttribute("userId");

        if (reporterId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            reportVO.setReporterId(reporterId);
            reportVO.setTargetId(postId);
            reportVO.setReportType("post");
            reportService.createReport(reportVO);

            response.put("status", "success");
            response.put("message", "게시글 신고가 성공적으로 접수되었습니다.");
            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            // [수정된 부분] 중복 신고 예외를 명확히 처리하여 409 Conflict 반환
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            // 그 외 다른 예외 처리
            response.put("status", "error");
            response.put("message", "게시글 신고 접수를 이미 하셨습니다. " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
}
