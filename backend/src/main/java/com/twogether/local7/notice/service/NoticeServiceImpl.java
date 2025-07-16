package com.twogether.local7.notice.service;

import com.twogether.local7.notice.dao.NoticeDAO;
import com.twogether.local7.notice.vo.NoticeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeDAO noticeDAO;

    @Override
    public List<NoticeVO> getNoticeList() {
        return noticeDAO.getNoticeList();
    }

    @Override
    public NoticeVO getNotice(Long noticeId) {
        return noticeDAO.getNotice(noticeId);
    }

    @Override
    public void insertNotice(NoticeVO notice) {
        noticeDAO.insertNotice(notice);
    }

    @Override
    public void updateNotice(NoticeVO notice) {
        noticeDAO.updateNotice(notice);
    }

    @Override
    public void deleteNotice(Long noticeId) {
        noticeDAO.deleteNotice(noticeId);
    }
}

