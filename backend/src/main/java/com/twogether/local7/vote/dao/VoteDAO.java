package com.twogether.local7.vote.dao;

import com.twogether.local7.vote.vo.VoteVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VoteDAO {
    //view_count 추가
    void increaseViewCount(@Param("regionId") Long regionId);
    List<VoteVO> getAllVotes();
    // 투표하는 DB에서 user_id 가져오기
    List<VoteVO> getUserById(Long userId);
    //투표 완표 표시
    void updateHasVoted(Long userId);

    List<VoteVO> getAllRegions();

    List<VoteVO> getAllPosts();

}
