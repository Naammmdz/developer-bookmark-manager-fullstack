package com.g1.bookmark_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionRequest {
    
    @NotBlank(message = "Collection name is required")
    @Size(min = 1, max = 100, message = "Collection name must be between 1 and 100 characters")
    private String name;
    
    @NotBlank(message = "Collection icon is required")
    @Size(min = 1, max = 50, message = "Collection icon must be between 1 and 50 characters")
    private String icon;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private Boolean isPublic = true;
    
    private Integer sortOrder = 0;
}
