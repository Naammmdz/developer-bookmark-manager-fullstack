package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    
    // Find all collections for a specific user
    List<Collection> findByUserOrderBySortOrder(User user);
    
    // Find collection by name and user
    Optional<Collection> findByNameAndUser(String name, User user);
    
    // Find all public collections
    @Query("SELECT c FROM Collection c WHERE c.isPublic = true ORDER BY c.sortOrder")
    List<Collection> findAllPublicCollections();
    
    // Find collections by user with bookmark count
    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.bookmarks WHERE c.user = :user ORDER BY c.sortOrder")
    List<Collection> findByUserWithBookmarks(@Param("user") User user);
    
    // Check if collection name exists for user
    boolean existsByNameAndUser(String name, User user);
    
    // Find default collections for user
    List<Collection> findByUserAndIsDefaultTrue(User user);
    
    // Get next sort order for user
    @Query("SELECT COALESCE(MAX(c.sortOrder), 0) + 1 FROM Collection c WHERE c.user = :user")
    Integer getNextSortOrder(@Param("user") User user);
    
    // Find collections by user and public status
    List<Collection> findByUserAndIsPublic(User user, Boolean isPublic);
    
    // Count collections for user
    long countByUser(User user);
}
