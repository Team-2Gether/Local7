package com.twogether.local7.notice.controller;

import com.twogether.local7.notice.service.NoticeService;
import com.twogether.local7.notice.vo.NoticeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // 목록 조회
    @GetMapping("/list")
    public List<NoticeVO> getNoticeList() {
        return noticeService.getNoticeList();
    }

    // 단건 조회
    @GetMapping("/{id}")
    public NoticeVO getNotice(@PathVariable("id") Long id) {
        return noticeService.getNotice(id);
    }

    // 등록
    @PostMapping("/add")
    public void insertNotice(@RequestBody NoticeVO notice) {
        noticeService.insertNotice(notice);
    }

    // 수정
    @PutMapping("/update")
    public void updateNotice(@RequestBody NoticeVO notice) {
        noticeService.updateNotice(notice);
    }

    // 삭제
    @DeleteMapping("/delete/{id}")
    public void deleteNotice(@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
    }
}

