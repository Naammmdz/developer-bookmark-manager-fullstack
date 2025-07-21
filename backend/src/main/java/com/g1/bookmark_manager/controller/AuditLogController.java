package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.entity.AuditLog;
import com.g1.bookmark_manager.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    // 📌 Truy xuất lịch sử của một người dùng
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLog>> getLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(auditLogService.getLogsByUser(userId));
    }

    // 📌 Truy xuất tất cả log (nội bộ/admin)
    @GetMapping("/all")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}
