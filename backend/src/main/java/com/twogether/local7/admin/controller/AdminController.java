package com.twogether.local7.admin.controller;

import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 사용자 목록 조회
    @GetMapping("/users")
    public ResponseEntity<List<UserVO>> getAllUsers(@RequestHeader("X-USER-ID") Long adminId) {
        // 실제 운영 환경에서는 세션 또는 JWT를 통해 관리자 권한을 확인해야 합니다.
        // 여기서는 임시로 요청 헤더의 X-USER-ID를 사용합니다.
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음
        }
        List<UserVO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 게시글 목록 조회
    @GetMapping("/posts")
    public ResponseEntity<List<PostVO>> getAllPosts(@RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<PostVO> posts = adminService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // 댓글 목록 조회
    @GetMapping("/comments")
    public ResponseEntity<List<CommentVO>> getAllComments(@RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<CommentVO> comments = adminService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    // 신고 목록 조회
    @GetMapping("/reports")
    public ResponseEntity<List<ReportVO>> getAllReports(@RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ReportVO> reports = adminService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    // 게시글 삭제
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        adminService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        adminService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 신고 상태 업데이트
    @PatchMapping("/reports/{reportId}/status")
    public ResponseEntity<Void> updateReportStatus(@PathVariable Long reportId, @RequestBody Map<String, String> request, @RequestHeader("X-USER-ID") Long adminId) {
        if (!adminService.isAdmin(adminId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        String newStatus = request.get("status");
        adminService.updateReportStatus(reportId, newStatus);
        return ResponseEntity.noContent().build();
    }
}