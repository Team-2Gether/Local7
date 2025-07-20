package com.twogether.local7.admin.service;

import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.user.vo.UserVO;

import java.util.List;

public interface AdminService {

    boolean isAdmin(Long userId);

    // 사용자 관련
    List<UserVO> getAllUsers();

    // 게시글 관련
    List<PostVO> getAllPosts();
    void deletePost(Long postId);

    // 댓글 관련
    List<CommentVO> getAllComments();
    void deleteComment(Long commentId);

    // 신고 관련
    List<ReportVO> getAllReports();
    void updateReportStatus(Long reportId, String status);

}