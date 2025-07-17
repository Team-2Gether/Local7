package com.twogether.local7.vote.service;

import com.twogether.local7.vote.dao.VoteRegionDAO;
import com.twogether.local7.vote.vo.VoteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteRegionServiceImpl implements VoteRegionService {

    @Autowired
    private VoteRegionDAO voteRegionDAO;

    @Override
    public List<VoteVO> getAllRegions() {
        return voteRegionDAO.getAllRegions();
    }
}
