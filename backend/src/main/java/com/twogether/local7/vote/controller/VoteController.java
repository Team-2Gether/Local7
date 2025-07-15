package com.twogether.local7.vote.controller;

import com.twogether.local7.region.service.RegionService;
import com.twogether.local7.region.vo.RegionVO;
import com.twogether.local7.vote.service.VoteRegionService;
import com.twogether.local7.vote.vo.VoteRegionVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/VoteRegions")
public class VoteController {

    @Autowired
    private VoteRegionService voteRegionService;

    @GetMapping
    public List<VoteRegionVO> getRegions() {
        return voteRegionService.getAllRegions();
    }
}



