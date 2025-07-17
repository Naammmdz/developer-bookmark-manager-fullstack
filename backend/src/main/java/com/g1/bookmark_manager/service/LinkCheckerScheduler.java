package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.service.LinkValidationService.LinkStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LinkCheckerScheduler {
    @Autowired
    private BookmarkRepository bookmarkRepository;
    @Autowired
    private LinkValidationService linkValidationService;

    // Chạy mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void checkAllLinksAndUpdateStatus() {
        List<Bookmark> bookmarks = bookmarkRepository.findAll();
        for (Bookmark bookmark : bookmarks) {
            LinkStatus status = linkValidationService.checkLink(bookmark.getUrl());
            bookmark.setLinkStatus(status.name());
        }
        bookmarkRepository.saveAll(bookmarks);
    }
} 