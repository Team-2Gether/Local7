package com.twogether.local7.region.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class RegionVO {
    private Long regionId;
    private String regionName;
    private String regionDescription;
    private Integer viewCount;
    private String createdId;
    private String updatedId;
    private Timestamp createdDate;
    private Timestamp updatedDate;
}
