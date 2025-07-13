package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    List<Bookmark> findByUserAndIsFavoriteTrue(User user);
    
    // Pagination methods
    Page<Bookmark> findByUser(User user, Pageable pageable);
    Page<Bookmark> findByUserAndIsFavoriteTrue(User user, Pageable pageable);
    Page<Bookmark> findByUserAndCollection(User user, com.g1.bookmark_manager.entity.Collection collection, Pageable pageable);
    Page<Bookmark> findByUserAndCollectionIsNull(User user, Pageable pageable);
    
    // Collection-related queries
    List<Bookmark> findByCollection(com.g1.bookmark_manager.entity.Collection collection);
    List<Bookmark> findByUserAndCollection(User user, com.g1.bookmark_manager.entity.Collection collection);
    List<Bookmark> findByUserAndCollectionIsNull(User user);
    
    @Query("SELECT b FROM Bookmark b WHERE b.user = :user AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.tags) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Bookmark> searchBookmarks(@Param("user") User user, @Param("keyword") String keyword);
    
}
