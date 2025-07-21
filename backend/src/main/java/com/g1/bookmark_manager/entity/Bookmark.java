package com.g1.bookmark_manager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookmarks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String url;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "bookmark_tags", joinColumns = @JoinColumn(name = "bookmark_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(name = "collection")
    private String collection;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private Collection collectionEntity;
    
    @Column(name = "is_public")
    private Boolean isPublic = true;
    
    @Column(name = "is_favorite")
    private Boolean isFavorite = false;
    
    @Column(name = "favicon")
    private String favicon;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
