package com.g1.bookmark_manager.dto.response;

import com.g1.bookmark_manager.entity.Collection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionResponse {
    private Long id;
    private String name;
    private String icon;
    private String description;
    private Boolean isPublic;
    private Boolean isDefault;
    private Integer sortOrder;
    private int count;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructor from entity
    public CollectionResponse(Collection collection) {
        this.id = collection.getId();
        this.name = collection.getName();
        this.icon = collection.getIcon();
        this.description = collection.getDescription();
        this.isPublic = collection.getIsPublic();
        this.isDefault = collection.getIsDefault();
        this.sortOrder = collection.getSortOrder();
        this.count = collection.getBookmarkCount();
        this.createdAt = collection.getCreatedAt();
        this.updatedAt = collection.getUpdatedAt();
    }

    public static CollectionResponse fromEntity(Collection collection) {
        return new CollectionResponse(collection);
    }
}
