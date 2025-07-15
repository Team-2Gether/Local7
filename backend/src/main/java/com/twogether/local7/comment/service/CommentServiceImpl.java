package com.twogether.local7.comment.service;

import com.twogether.local7.comment.dao.CommentDAO;
import com.twogether.local7.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentDAO commentDAO;

    @Override
    public List<CommentVO> getCommentList(Long postId) {
        return commentDAO.selectCommentList(postId);
    }

    @Override
    @Transactional
    public void createComment(CommentVO comment) {
        commentDAO.insertComment(comment);
        commentDAO.incrementCommentCount(comment.getPostId());
    }

    @Override
    @Transactional
    public boolean updateComment(Long commentId, CommentVO comment, Long userId) {
        CommentVO originalComment = commentDAO.selectComment(commentId);

        if (originalComment != null && originalComment.getUserId().equals(userId)) {
            comment.setCommentId(commentId);
            commentDAO.updateComment(comment);
            return true;
        }

        return false;
    }

    @Override
    @Transactional
    public boolean deleteComment(Long commentId, Long userId) {
        CommentVO comment = commentDAO.selectComment(commentId);

        if (comment != null && comment.getUserId().equals(userId)) {
            commentDAO.deleteComment(commentId);
            commentDAO.decrementCommentCount(comment.getPostId());
            return true;
        }
        return false;
    }
}