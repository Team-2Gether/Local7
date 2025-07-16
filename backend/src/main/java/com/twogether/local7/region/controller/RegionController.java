package com.twogether.local7.region.controller;

import com.twogether.local7.region.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping("/api/cities")
    public List<String> getRegionNames() {
        return regionService.getAllRegionNames();
    }
}
