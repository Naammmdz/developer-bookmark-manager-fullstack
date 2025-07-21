package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<AuditLog> findAllByOrderByTimestampDesc();

}

