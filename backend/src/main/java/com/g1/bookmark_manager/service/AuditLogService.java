package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.entity.AuditLog;
import com.g1.bookmark_manager.enums.AuditAction;
import com.g1.bookmark_manager.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository repo;

    public void log(Long userId, AuditAction action, String desc) {
        repo.save(new AuditLog(null, userId, action, desc, LocalDateTime.now()));
    }

    public List<AuditLog> getLogsByUser(Long userId) {
        return repo.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AuditLog> getAllLogs() {
        return repo.findAll(); // Chỉ dùng cho admin
    }

}
