package com.g1.bookmark_manager.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "bookmarks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    @Column(nullable = false, length = 500)
    private String title;

    @NotBlank(message = "URL is required")
    @URL(message = "Invalid URL format")
    @Size(max = 2048, message = "URL must not exceed 2048 characters")
    @Column(nullable = false, length = 2048)
    private String url;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "bookmark_tags",
            joinColumns = @JoinColumn(name = "bookmark_id")
    )
    @Column(name = "tag")
    private List<String> tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private Collection collection;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;

    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Size(max = 2048, message = "Favicon URL must not exceed 2048 characters")
    @Column(name = "favicon_url", length = 2048)
    private String favicon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Additional metadata fields that might be useful
    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @Column(name = "display_order")
    private Integer displayOrder;

    // Constructor for creating new bookmarks
    public Bookmark(String title, String url, String description, List<String> tags,
                    Collection collection, Boolean isPublic, String favicon, User user) {
        this.title = title;
        this.url = url;
        this.description = description;
        this.tags = tags;
        this.collection = collection;
        this.isPublic = isPublic;
        this.favicon = favicon;
        this.user = user;
        this.isFavorite = false;
        this.clickCount = 0;
    }

    // Helper methods.
    public void incrementClickCount() {
        this.clickCount = (this.clickCount == null) ? 1 : this.clickCount + 1;
        this.lastAccessed = LocalDateTime.now();
    }

    public void toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
}

