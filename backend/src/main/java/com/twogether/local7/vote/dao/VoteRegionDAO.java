package com.twogether.local7.vote.dao;

import com.twogether.local7.vote.vo.VoteVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface VoteRegionDAO {
    List<VoteVO> getAllRegions();
}
