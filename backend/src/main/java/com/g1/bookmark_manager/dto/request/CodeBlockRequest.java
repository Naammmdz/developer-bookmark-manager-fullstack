package com.g1.bookmark_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CodeBlockRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Language is required")
    @Size(max = 50, message = "Language must be less than 50 characters")
    private String language;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;
    
    private List<String> tags;
    
    private String collection;
    
    private Boolean isPublic = true;
    
    private Boolean isFavorite = false;
}
