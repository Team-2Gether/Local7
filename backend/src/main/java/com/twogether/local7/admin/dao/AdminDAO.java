package com.twogether.local7.admin.dao;

import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface AdminDAO {

    List<UserVO> selectAllUsers();

    // 게시글 관련
    List<PostVO> selectAllPosts();
    int deletePost(Long postId);

    // 댓글 관련
    List<CommentVO> selectAllComments();
    int deleteComment(Long commentId);

    // 신고 관련
    List<ReportVO> selectAllReports();
    int updateReportStatus(Long reportId, String status);

}