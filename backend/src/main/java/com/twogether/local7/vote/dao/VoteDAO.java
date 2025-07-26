package com.twogether.local7.vote.dao;

import com.twogether.local7.vote.vo.VoteVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VoteDAO {
    //view_count 증가
    void increaseViewCount(@Param("regionId") Long regionId);

    //투표 여부 조회
    List<VoteVO> getUserById(Long userId);

    //투표 완료시 has_voted 값을 'Y'로 번경
    void updateHasVoted(Long userId);

    //투표 완료시 voted_region 값 업데이트
    void updateVotedRegion(@Param("userId") Long userId, @Param("regionId") Long regionId);

    //투표 수 리스트 조회
    List<VoteVO> getAllViewCount();

    //전체 지역 리스트 조회
    List<VoteVO> getAllRegions();

    //게시글 목록 불러오기
    List<VoteVO> getAllPosts();

}