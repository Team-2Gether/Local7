package com.twogether.local7.comment.dao;

import com.twogether.local7.comment.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentDAO {

    // 댓글 목록 조회 (정렬 기준 및 현재 사용자 ID)
    List<CommentVO> selectCommentList(
            @Param("postId") Long postId,
            @Param("sortOrder") String sortOrder,
            @Param("currentUserId") Long currentUserId
    );

    void insertComment(CommentVO comment);

    void updateComment(CommentVO comment);

    int deleteComment(Long commentId);

    CommentVO selectComment(Long commentId);

    void incrementCommentCount(@Param("postId") Long postId);

    int decrementCommentCount(@Param("postId") Long postId);

    // 특정 사용자가 특정 댓글에 좋아요를 눌렀는지 확인
    boolean checkCommentLike(
            @Param("commentId") Long commentId,
            @Param("userId") Long userId
    );

    // 댓글 좋아요 추가 (TB_COMMENT_LIKE 테이블에 삽입)
    void insertCommentLike(
            @Param("commentId") Long commentId,
            @Param("userId") Long userId
    );

    // 댓글 좋아요 삭제 (TB_COMMENT_LIKE 테이블에서 삭제)
    void deleteCommentLike(
            @Param("commentId") Long commentId,
            @Param("userId") Long userId
    );

    // TB_COMMENT 테이블의 좋아요 개수 증가
    void incrementCommentLikeCount(@Param("commentId") Long commentId);

    // TB_COMMENT 테이블의 좋아요 개수 감소
    void decrementCommentLikeCount(@Param("commentId") Long commentId);

    // 특정 댓글에 대한 모든 좋아요 삭제
    void deleteCommentLikesByCommentId(@Param("commentId") Long commentId);
}