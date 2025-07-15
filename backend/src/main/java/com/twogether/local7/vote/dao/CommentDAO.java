package com.twogether.local7.vote.dao;

import com.twogether.local7.vote.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper // MyBatis에게 이 인터페이스를 SQL Mapper와 연결하라고 알려줌
public interface CommentDAO {

    List<CommentVO> getAllComments(); // 댓글 전체 가져오기

    void insertComment(CommentVO comment); // 댓글 등록 (선택)
}
