package com.twogether.local7.comment.service;

import com.twogether.local7.comment.vo.CommentVO;
import java.util.List;

public interface CommentService {

    // 게시글의 댓글 목록 가져오기
    List<CommentVO> getCommentList(Long postId);

    // 댓글 작성
    void createComment(CommentVO comment);

    // 댓글 수정
    boolean updateComment(Long commentId, CommentVO comment, Long userId);

    // 댓글 삭제
    boolean deleteComment(Long commentId, Long userId);

}