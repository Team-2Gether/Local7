package com.twogether.local7.comment.controller;

import com.twogether.local7.comment.service.CommentService;
import com.twogether.local7.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession; // HttpSession import 추가

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 특정 게시글의 댓글 전체 조회
    @GetMapping
    public ResponseEntity<List<CommentVO>> getComments(@PathVariable Long postId) {
        List<CommentVO> comments = commentService.getCommentList(postId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 생성
    @PostMapping
    public ResponseEntity<String> createComment(@PathVariable Long postId, @RequestBody CommentVO comment, HttpSession session) { // HttpSession 추가
        // 세션에서 현재 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            // 로그인되지 않은 사용자일 경우 에러 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 작성할 수 있습니다.");
        }

        comment.setPostId(postId);
        comment.setUserId(currentUserId); // 세션에서 가져온 userId 사용
        commentService.createComment(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body("댓글이 성공적으로 등록되었습니다.");
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @RequestBody CommentVO comment, HttpSession session) { // HttpSession 추가
        // 세션에서 현재 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            // 로그인되지 않은 사용자일 경우 에러 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 수정할 수 있습니다.");
        }

        boolean isSuccess = commentService.updateComment(commentId, comment, currentUserId); // 세션에서 가져온 userId 사용

        if (isSuccess) {
            return ResponseEntity.ok("댓글이 성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("댓글 수정 권한이 없습니다.");
        }
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, HttpSession session) { // HttpSession 추가
        // 세션에서 현재 사용자 ID 가져오기
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            // 로그인되지 않은 사용자일 경우 에러 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 삭제할 수 있습니다.");
        }

        boolean isSuccess = commentService.deleteComment(commentId, currentUserId); // 세션에서 가져온 userId 사용

        if (isSuccess) {
            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("댓글 삭제 권한이 없습니다.");
        }
    }
}