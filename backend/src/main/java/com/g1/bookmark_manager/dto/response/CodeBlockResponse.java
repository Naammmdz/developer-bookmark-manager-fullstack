package com.g1.bookmark_manager.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CodeBlockResponse {
    private Long id;
    private String title;
    private String code;
    private String language;
    private String description;
    private List<String> tags;
    private String collection;
    private Boolean isPublic;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String userEmail;
}
