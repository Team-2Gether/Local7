package com.twogether.local7.vote.dao;

import com.twogether.local7.vote.vo.VotePostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface VotePostDAO {
    List<VotePostVO> getAllPosts();
}
