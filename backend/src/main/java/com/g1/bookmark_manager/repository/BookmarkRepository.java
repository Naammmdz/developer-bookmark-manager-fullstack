package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    List<Bookmark> findByUserAndIsFavoriteTrue(User user);
    List<Bookmark> findByUserAndCategory(User user, String category);
    
    @Query("SELECT b FROM Bookmark b WHERE b.user = :user AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.tags) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Bookmark> searchBookmarks(@Param("user") User user, @Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT b.category FROM Bookmark b WHERE b.user = :user AND b.category IS NOT NULL")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);
}
