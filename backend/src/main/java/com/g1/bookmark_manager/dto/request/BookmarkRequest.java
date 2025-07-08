package com.g1.bookmark_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookmarkRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "URL is required")
    private String url;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private String category;
    
    private String tags;
    
    private Boolean isFavorite = false;
}
