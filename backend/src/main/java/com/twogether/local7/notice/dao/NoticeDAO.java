package com.twogether.local7.notice.dao;

import com.twogether.local7.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface NoticeDAO {

    List<NoticeVO> getNoticeList();

    NoticeVO getNotice(Long noticeId);

    void insertNotice(NoticeVO notice);

    void updateNotice(NoticeVO notice);

    void deleteNotice(Long noticeId);
}

