package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    List<Bookmark> findByUserAndIsFavoriteTrue(User user);
    List<Bookmark> findByUserAndCollection(User user, String collection);
    List<Bookmark> findByUserAndIsPublicTrue(User user);
    List<Bookmark> findByIsPublicTrue();
    
    @Query("SELECT b FROM Bookmark b WHERE b.user = :user AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Bookmark> searchBookmarks(@Param("user") User user, @Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT b.collection FROM Bookmark b WHERE b.user = :user AND b.collection IS NOT NULL")
    List<String> findDistinctCollectionsByUser(@Param("user") User user);
    
    @Query("SELECT b FROM Bookmark b JOIN b.tags t WHERE b.user = :user AND LOWER(t) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Bookmark> findByUserAndTagsContaining(@Param("user") User user, @Param("tag") String tag);

    List<Bookmark> findAll(Specification<Bookmark> spec, Sort sort);
}
