package com.g1.bookmark_manager.entity;

import com.g1.bookmark_manager.enums.AuditAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private AuditAction action; // CREATE_COLLECTION, DELETE_BOOKMARK, etc.
    private String description;
    private LocalDateTime timestamp = LocalDateTime.now();
}
