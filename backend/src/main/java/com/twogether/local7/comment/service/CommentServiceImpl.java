package com.twogether.local7.comment.service;

import com.twogether.local7.comment.dao.CommentDAO;
import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.user.dao.UserDAO;
import com.twogether.local7.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {


    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class); // 로거 선언

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
        CommentVO originalComment = commentDAO.selectComment(commentId); // 이 시점의 originalComment는 삭제 전의 상태

        if (originalComment != null && (originalComment.getUserId().equals(userId) || (ruleId != null && ruleId == 1))) {
            Long postIdToUpdate = originalComment.getPostId(); // 댓글이 속한 게시글 ID
            logger.info("댓글 삭제 시작: commentId={}, postId={}", commentId, postIdToUpdate);

            // 1. 댓글 자체 삭제
            int deleteCommentResult = commentDAO.deleteComment(commentId);
            if (deleteCommentResult == 0) {
                logger.warn("댓글 삭제 실패: commentId={}. 해당 댓글이 없거나 권한 없음.", commentId);
                // 댓글 삭제 자체가 실패했다면, 더 진행할 필요가 없습니다.
                return false;
            }
            logger.info("댓글 삭제 성공: commentId={}", commentId);

            // 2. 게시글 댓글 수 감소
            if (postIdToUpdate != null) {
                logger.info("게시글 댓글 수 감소 시도: postId={}", postIdToUpdate);
                // decrementCommentCount 메서드의 반환 값을 받아 로깅합니다.
                // CommentDAO 인터페이스에서 decrementCommentCount의 반환 타입을 int로 변경해야 합니다.
                int affectedRows = commentDAO.decrementCommentCount(postIdToUpdate);
                logger.info("게시글 댓글 수 감소 결과: postId={}, affectedRows={}", postIdToUpdate, affectedRows);

                // 만약 affectedRows가 0이라면, 업데이트가 되지 않았음을 의미합니다.
                if (affectedRows == 0) {
                    logger.warn("게시글 댓글 수 감소 실패 또는 대상 게시글 없음: postId={}", postIdToUpdate);
                }
            } else {
                logger.warn("originalComment에서 postId를 가져올 수 없습니다. 댓글 수 감소 건너_입니다.");
            }


            // 3. 댓글 좋아요 삭제 (이 부분은 COMMENT_COUNT와는 별개)
            commentDAO.deleteCommentLikesByCommentId(commentId);
            logger.info("댓글 좋아요 삭제 완료: commentId={}", commentId);

            return true;
        }
        logger.warn("댓글 삭제 권한 없음: commentId={}, userId={}, ruleId={}", commentId, userId, ruleId);
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