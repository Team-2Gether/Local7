package com.twogether.local7.comment.controller;

import com.twogether.local7.comment.service.CommentService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.report.service.ReportService;
import com.twogether.local7.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // 기본 경로 변경
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private ReportService reportService;

    // 특정 게시글의 댓글 전체 조회
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentVO>> getComments(
            @PathVariable Long postId,
            @RequestParam(name = "sort", defaultValue = "latest") String sortOrder,
            HttpSession session
    ) {
        // 현재 로그인한 사용자 ID
        Long currentUserId = (Long) session.getAttribute("userId");

        List<CommentVO> comments = commentService.getCommentList(postId, sortOrder, currentUserId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 생성
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<String> createComment(@PathVariable Long postId, @RequestBody CommentVO comment, HttpSession session) {
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 작성할 수 있습니다.");
        }

        comment.setPostId(postId);
        comment.setUserId(currentUserId);
        commentService.createComment(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body("댓글이 성공적으로 등록되었습니다.");
    }

    // 댓글 수정
    @PutMapping("/posts/{postId}/comments/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @RequestBody CommentVO comment, HttpSession session) {
        Long currentUserId = (Long) session.getAttribute("userId");
        Long ruleId = (Long) session.getAttribute("ruleId");

        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 수정할 수 있습니다.");
        }

        // 서비스 메서드에 ruleId를 함께 전달
        boolean isSuccess = commentService.updateComment(commentId, comment, currentUserId, ruleId);

        if (isSuccess) {
            return ResponseEntity.ok("댓글이 성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("댓글 수정 권한이 없습니다.");
        }
    }

    // 댓글 삭제
    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, HttpSession session) {
        Long currentUserId = (Long) session.getAttribute("userId");
        Long ruleId = (Long) session.getAttribute("ruleId");

        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 댓글을 삭제할 수 있습니다.");
        }

        // 서비스 메서드에 ruleId를 함께 전달
        boolean isSuccess = commentService.deleteComment(commentId, currentUserId, ruleId);

        if (isSuccess) {
            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("댓글 삭제 권한이 없습니다.");
        }
    }

    // 댓글 좋아요 토글 엔드포인트
    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<String> toggleCommentLike(@PathVariable Long commentId, @RequestBody CommentVO commentVO, HttpSession session) {
        Long currentUserId = (Long) session.getAttribute("userId");

        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 좋아요를 누를 수 있습니다.");
        }

        try {
            String result = commentService.toggleCommentLike(commentId, currentUserId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("좋아요 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/report") // "/comments"를 추가
    public ResponseEntity<Map<String, Object>> reportComment(@PathVariable Long commentId, @RequestBody ReportVO reportVO, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Long reporterId = (Long) session.getAttribute("userId");

        if (reporterId == null) {
            response.put("status", "error");
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            reportVO.setReporterId(reporterId);
            reportVO.setTargetId(commentId);
            reportVO.setReportType("comment");
            reportService.createReport(reportVO);

            response.put("status", "success");
            response.put("message", "댓글 신고가 성공적으로 접수되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "댓글 신고 접수 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}