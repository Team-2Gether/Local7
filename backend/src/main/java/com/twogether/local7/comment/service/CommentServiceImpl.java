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
            // 댓글 삭제 시 해당 댓글의 좋아요도 모두 삭제
            commentDAO.deleteCommentLikesByCommentId(commentId);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    // 댓글 좋아요 토글
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