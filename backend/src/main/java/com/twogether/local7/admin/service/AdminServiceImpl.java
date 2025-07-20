package com.twogether.local7.admin.service.impl;

import com.twogether.local7.admin.dao.AdminDAO;
import com.twogether.local7.admin.service.AdminService;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminDAO adminDAO;
    private final UserDAO userDAO;

    @Override
    public boolean isAdmin(Long userId) {
        UserVO user = userDAO.findByUserId(userId);
        return user != null && user.getRuleId() != null && user.getRuleId() == 1;
    }

    @Override
    public List<UserVO> getAllUsers() {
        return adminDAO.selectAllUsers();
    }

    @Override
    public List<PostVO> getAllPosts() {
        return adminDAO.selectAllPosts();
    }

    @Override
    public void deletePost(Long postId) {
        adminDAO.deletePost(postId);
    }

    @Override
    public List<CommentVO> getAllComments() {
        return adminDAO.selectAllComments();
    }

    @Override
    public void deleteComment(Long commentId) {
        adminDAO.deleteComment(commentId);
    }

    @Override
    public List<ReportVO> getAllReports() {
        return adminDAO.selectAllReports();
    }

    @Override
    public void updateReportStatus(Long reportId, String status) {
        adminDAO.updateReportStatus(reportId, status);
    }
}