package com.twogether.local7.admin.service;

import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.pagintion.Pagination;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.review.vo.ReviewVO;
import com.twogether.local7.user.vo.UserVO;

public interface AdminService {

    boolean isAdmin(Long userId);

    // 사용자 관련
    Pagination<UserVO> getAllUsers(int pageNumber, int pageSize);

    // 게시글 관련
    Pagination<PostVO> getAllPosts(int pageNumber, int pageSize);
    void deletePost(Long postId);

    // 리뷰 관련
    Pagination<ReviewVO> getAllReviews(int pageNumber, int pageSize);
    void deleteReview(Long reviewId);

    // 댓글 관련
    Pagination<CommentVO> getAllComments(int pageNumber, int pageSize);
    void deleteComment(Long commentId);

    // 신고 관련
    Pagination<ReportVO> getAllReports(int pageNumber, int pageSize);
    void updateReportStatus(Long reportId, String status);

    void deleteContentFromReport(Long reportId);

    // 사용자 삭제
    void deleteUser(Long userId);

}