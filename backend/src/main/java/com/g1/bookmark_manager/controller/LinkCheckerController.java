package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.service.AuthService;
import com.g1.bookmark_manager.service.LinkValidationService;
import com.g1.bookmark_manager.service.LinkValidationService.LinkStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/link-checker")
public class LinkCheckerController {
    @Autowired
    private LinkValidationService linkValidationService;
    @Autowired
    private BookmarkRepository bookmarkRepository;
    @Autowired
    private AuthService authService;

    @PostMapping("/{id}/check")
    public ResponseEntity<?> checkBookmarkLink(@PathVariable Long id) {
        Bookmark bookmark = bookmarkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bookmark not found with id: " + id));
        LinkStatus status = linkValidationService.checkLink(bookmark.getUrl());
        return ResponseEntity.ok().body(new LinkCheckResult(status.name()));
    }

    @GetMapping("/dead-links")
    public ResponseEntity<?> getDeadLinks(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        var user = authService.findByUsername(username);
        List<Bookmark> bookmarks = bookmarkRepository.findByUser(user);
        List<Bookmark> deadLinks = bookmarks.stream()
            .filter(b -> {
                LinkStatus status = linkValidationService.checkLink(b.getUrl());
                return status == LinkStatus.DEAD || status == LinkStatus.ERROR;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(deadLinks);
    }

    @PostMapping("/batch-check")
    public ResponseEntity<?> batchCheckLinks(@RequestBody List<Long> bookmarkIds) {
        List<BatchLinkCheckResult> results = bookmarkIds.stream()
            .map(id -> {
                return bookmarkRepository.findById(id)
                    .map(b -> new BatchLinkCheckResult(b.getId(), linkValidationService.checkLink(b.getUrl()).name()))
                    .orElse(new BatchLinkCheckResult(id, "NOT_FOUND"));
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    public static class LinkCheckResult {
        private String status;
        public LinkCheckResult(String status) { this.status = status; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class BatchLinkCheckResult {
        private Long id;
        private String status;
        public BatchLinkCheckResult(Long id, String status) {
            this.id = id;
            this.status = status;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
} 