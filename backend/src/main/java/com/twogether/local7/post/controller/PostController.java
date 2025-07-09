package com.twogether.local7.post.controller;

import com.twogether.local7.post.service.PostService;
import com.twogether.local7.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // 모든 게시글 조회 (GET /api/posts)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts() {
        List<PostVO> posts = postService.getAllPosts();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "모든 게시글을 성공적으로 조회했습니다.");
        response.put("data", posts);
        return ResponseEntity.ok(response);
    }

    // 특정 게시글 ID로 조회 (GET /api/posts/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable("id") Long postId) {
        PostVO post = postService.getPostById(postId);
        Map<String, Object> response = new HashMap<>();
        if (post != null) {
            response.put("status", "success");
            response.put("message", "게시글을 성공적으로 조회했습니다.");
            response.put("data", post);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "게시글을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 게시글 생성 (POST /api/posts)
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@RequestBody PostVO post) {
        try {
            post.setUserId(1L);
            post.setCreatedId("user");
            post.setUpdatedId("user");

            if (post.getIsNotice() == null || post.getIsNotice().isEmpty()) {
                post.setIsNotice("N");
            }

            postService.createPost(post);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "게시글이 성공적으로 생성되었습니다.");
            response.put("data", post);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "게시글 생성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시글 업데이트 (PUT /api/posts/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(@PathVariable("id") Long postId, @RequestBody PostVO post) {
        PostVO existingPost = postService.getPostById(postId);
        Map<String, Object> response = new HashMap<>();
        if (existingPost != null) {
            post.setPostId(postId);
            post.setUpdatedId("user");

            postService.updatePost(post);
            response.put("status", "success");
            response.put("message", "게시글이 성공적으로 업데이트되었습니다.");
            response.put("data", post);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "게시글을 찾을 수 없어 업데이트할 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 게시글 삭제 (DELETE /api/posts/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable("id") Long postId) {
        PostVO existingPost = postService.getPostById(postId);
        Map<String, Object> response = new HashMap<>();
        if (existingPost != null) {
            postService.deletePost(postId);
            response.put("status", "success");
            response.put("message", "게시글이 성공적으로 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "게시글을 찾을 수 없어 삭제할 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

}
