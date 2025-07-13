package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUser(User user);
    Page<Collection> findByUser(User user, Pageable pageable);
    List<Collection> findByUserAndIsPublicTrue(User user);
    Page<Collection> findByUserAndIsPublicTrue(User user, Pageable pageable);
    Optional<Collection> findByIdAndUser(Long id, User user);
    
    @Query("SELECT c FROM Collection c WHERE c.user = :user AND " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Collection> searchCollections(@Param("user") User user, @Param("keyword") String keyword);
    
    // Count bookmarks in collections
    @Query("SELECT c, COUNT(b) FROM Collection c LEFT JOIN c.bookmarks b WHERE c.user = :user GROUP BY c")
    List<Object[]> findCollectionsWithBookmarkCount(@Param("user") User user);
}
