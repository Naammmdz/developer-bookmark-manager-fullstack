package com.g1.bookmark_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkResponse {
    private Long id;
    private String title;
    private String url;
    private String description;
    private String collection;
    private List<String> tags;
    private Boolean isFavorite;
    private Boolean isPublic;
    private String favicon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username;
}
