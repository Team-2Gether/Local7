package com.twogether.local7.comment.dao;

import com.twogether.local7.comment.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentDAO {

    List<CommentVO> selectCommentList(Long postId);

    void insertComment(CommentVO comment);

    void updateComment(CommentVO comment);

    void deleteComment(Long commentId);

    CommentVO selectComment(Long commentId);

    void incrementCommentCount(@Param("postId") Long postId);

    void decrementCommentCount(@Param("postId") Long postId);

}