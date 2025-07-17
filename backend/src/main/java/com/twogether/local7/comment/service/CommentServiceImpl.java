package com.twogether.local7.comment.service;

import com.twogether.local7.comment.dao.CommentDAO;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentDAO commentDAO;

    @Override
    public List<CommentVO> getCommentList(Long postId, String sortOrder, Long currentUserId) {
        return commentDAO.selectCommentList(postId, sortOrder, currentUserId);
    }

    @Override
    @Transactional
    public void createComment(CommentVO comment) {
        commentDAO.insertComment(comment);
        commentDAO.incrementCommentCount(comment.getPostId());
    }

    @Override
    @Transactional
    public boolean updateComment(Long commentId, CommentVO comment, Long userId, Long ruleId) {
        CommentVO originalComment = commentDAO.selectComment(commentId);

        if (originalComment != null && (originalComment.getUserId().equals(userId) || (ruleId != null && ruleId == 1))) {
            comment.setCommentId(commentId);
            commentDAO.updateComment(comment);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteComment(Long commentId, Long userId, Long ruleId) {
        CommentVO originalComment = commentDAO.selectComment(commentId);

        // 원본 작성자이거나 ruleId가 1인 경우에만 허용
        if (originalComment != null && (originalComment.getUserId().equals(userId) || (ruleId != null && ruleId == 1))) {
            commentDAO.deleteComment(commentId);
            commentDAO.decrementCommentCount(originalComment.getPostId());
            commentDAO.deleteCommentLikesByCommentId(commentId);
            return true;
        }
        return false;
    }

    // 댓글 좋아요 토글
    @Override
    @Transactional
    public String toggleCommentLike(Long commentId, Long userId) {
        // 이미 좋아요를 눌렀는지 확인
        boolean alreadyLiked = commentDAO.checkCommentLike(commentId, userId);

        if (alreadyLiked) {
            // 이미 좋아요를 눌렀다면 좋아요 취소 (TB_COMMENT_LIKE에서 삭제)
            commentDAO.deleteCommentLike(commentId, userId);
            // TB_COMMENT의 좋아요 개수 감소
            commentDAO.decrementCommentLikeCount(commentId);
            return "좋아요가 취소되었습니다.";
        } else {
            // 좋아요를 누르지 않았다면 좋아요 추가 (TB_COMMENT_LIKE에 삽입)
            commentDAO.insertCommentLike(commentId, userId);
            // TB_COMMENT의 좋아요 개수 증가
            commentDAO.incrementCommentLikeCount(commentId);
            return "좋아요가 추가되었습니다.";
        }
    }
}