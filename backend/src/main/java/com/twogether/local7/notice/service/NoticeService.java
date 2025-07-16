package com.twogether.local7.notice.service;

import com.twogether.local7.notice.vo.NoticeVO;
import java.util.List;

public interface NoticeService {

    List<NoticeVO> getNoticeList();

    NoticeVO getNotice(Long noticeId);

    void insertNotice(NoticeVO notice);

    void updateNotice(NoticeVO notice);

    void deleteNotice(Long noticeId);
}

