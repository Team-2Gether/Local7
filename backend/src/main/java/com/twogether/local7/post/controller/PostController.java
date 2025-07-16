package com.twogether.local7.post.controller;

import com.twogether.local7.like.service.LikeService;
import com.twogether.local7.post.service.PostService;
import com.twogether.local7.post.vo.PostVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private LikeService likeService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 모든 게시글 조회 (GET /api/posts)
    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(required = false) String sortBy, // <-- 이 라인 추가: sortBy 파라미터 받기
            HttpSession session) {

        List<PostVO> posts;

        // sortBy 값에 따라 다른 서비스 메서드 호출
        if (sortBy != null && !sortBy.isEmpty()) {
            posts = postService.getAllPosts(sortBy); // <-- 수정: sortBy를 인자로 전달
        } else {
            posts = postService.getAllPosts(); // 기본 정렬 (최신순)
        }

        Map<String, Object> response = new HashMap<>();

        Long currentUserId = (Long) session.getAttribute("userId"); // 현재 사용자 ID 가져오기

        // 각 게시글에 대해 좋아요 상태와 좋아요 개수 설정
        List<PostVO> postsWithLikeStatus = posts.stream().map(post -> {
            post.setLikeCount(likeService.getLikeCount(post.getPostId())); // 좋아요 개수 설정
            if (currentUserId != null) {
                post.setLiked(likeService.isLikedByUser(currentUserId, post.getPostId())); // 좋아요 상태 설정
            } else {
                post.setLiked(false); // 로그인되지 않은 경우 항상 false
            }
            return post;
        }).collect(Collectors.toList());

        response.put("status", "success");
        response.put("message", "모든 게시글을 성공적으로 조회했습니다.");
        response.put("data", postsWithLikeStatus); // <-- 수정: postsWithLikeStatus를 반환

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
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestPart("post") PostVO post,
            @RequestPart(value = "images", required = false) List<MultipartFile> files,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        List<String> imageUrls = new ArrayList<>();

        // 로그인된 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");
        String currentUserLoginId = (String) session.getAttribute("userLoginId");

        if (currentUserId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            // 업로드 디렉토리 생성 (없으면)
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 이미지 파일 저장 및 URL 생성
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String originalFilename = file.getOriginalFilename();
                        String fileExtension = "";

                        if (originalFilename != null && originalFilename.contains(".")) {
                            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                        }

                        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                        Path filePath = uploadPath.resolve(uniqueFileName);
                        Files.copy(file.getInputStream(), filePath);

                        String fileUrl = "/uploads/" + uniqueFileName;
                        imageUrls.add(fileUrl);
                    }
                }
            }

            // PostVO에 사용자 ID 및 생성자 ID 설정
            post.setUserId(currentUserId);
            post.setCreatedId(currentUserLoginId);
            post.setUpdatedId(currentUserLoginId);

            postService.createPost(post, imageUrls);

            response.put("status", "success");
            response.put("message", "게시글과 이미지가 성공적으로 생성되었습니다.");
            response.put("data", post);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "게시글 생성 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시글 업데이트 (PUT /api/posts/{id}) - 이미지 파일 추가
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable("id") Long postId,
            @RequestPart("post") PostVO post,
            @RequestPart(value = "images", required = false) List<MultipartFile> files,
            HttpSession session) { // HttpSession 추가

        Map<String, Object> response = new HashMap<>();

        // 로그인된 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");
        String currentUserLoginId = (String) session.getAttribute("userLoginId");

        if (currentUserId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 업데이트할 PostVO에 ID 설정
        post.setPostId(postId);
        post.setUpdatedId(currentUserLoginId); // 수정자 ID 설정

        List<String> imageUrls = new ArrayList<>();
        try {
            // 업로드 디렉토리 생성 (없으면)
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 새로운 이미지 파일 저장 및 URL 생성
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String originalFilename = file.getOriginalFilename();
                        String fileExtension = "";

                        if (originalFilename != null && originalFilename.contains(".")) {
                            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                        }

                        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                        Path filePath = uploadPath.resolve(uniqueFileName);
                        Files.copy(file.getInputStream(), filePath);

                        String fileUrl = "/uploads/" + uniqueFileName;
                        imageUrls.add(fileUrl);
                    }
                }
            }

            // PostService 호출하여 게시글 및 이미지 정보 업데이트 (사용자 ID 전달)
            boolean success = postService.updatePost(post, imageUrls, currentUserId);

            if (success) {
                response.put("status", "success");
                response.put("message", "게시글과 이미지가 성공적으로 업데이트되었습니다.");
                response.put("data", post);

                return ResponseEntity.ok(response);
            } else {
                // 게시글을 찾을 수 없거나, 본인 게시글이 아닌 경우
                response.put("status", "error");
                response.put("message", "게시글을 찾을 수 없거나, 수정 권한이 없습니다.");

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response); // 403 Forbidden
            }

        } catch (IOException e) {
            response.put("status", "error");
            response.put("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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

        // 세션에서 현재 로그인된 userId 가져오기
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

        if (!existingPost.getUserId().equals(currentUserId)) {
            response.put("status", "error");
            response.put("message", "게시글을 삭제할 권한이 없습니다. 본인이 작성한 게시글만 삭제할 수 있습니다.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            postService.deletePost(postId, currentUserId); // userId도 함께 전달
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
            response.put("liked", liked); // 좋아요 상태 (true: 좋아요, false: 좋아요 취소)
            response.put("likeCount", updatedLikeCount); // 최신 좋아요 개수

            String message = liked ? "게시글에 좋아요를 눌렀습니다." : "게시글 좋아요를 취소했습니다.";
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "좋아요 처리 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}