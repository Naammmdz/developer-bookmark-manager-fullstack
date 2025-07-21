package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);


    // 🔍 Tìm theo tên & user
    @Query("SELECT c FROM Collection c WHERE c.user = :user AND LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY c.sortOrder")
    List<Collection> searchByUserAndName(@Param("user") User user, @Param("keyword") String keyword);

    // 📊 Tổng collection & theo public/private
    long countByUser(User user);
    long countByUserAndIsPublic(User user, Boolean isPublic);

    // 📂 Danh sách collection
    List<Collection> findByUserOrderBySortOrder(User user);
    List<Collection> findByUserAndIsPublic(User user, Boolean isPublic);
    List<Collection> findByUserAndIsDefaultTrue(User user);

    // ✅ Kiểm tra tồn tại theo tên
    boolean existsByNameAndUser(String name, User user);

    // ✅ Tìm theo tên và user
    Optional<Collection> findByNameAndUser(String name, User user);

    // 🔝 Collection có nhiều bookmark nhất (tên)
    @Query("SELECT c.name FROM Collection c LEFT JOIN c.bookmarks b WHERE c.user = :user GROUP BY c.id, c.name ORDER BY COUNT(b) DESC")
    List<String> findTopCollectionNameByBookmarkCount(@Param("user") User user);


    // 🧾 Sắp xếp
    @Query("SELECT COALESCE(MAX(c.sortOrder), 0) + 1 FROM Collection c WHERE c.user = :user")
    Integer getNextSortOrder(@Param("user") User user);

    // 🌐 Danh sách public
    @Query("SELECT c FROM Collection c WHERE c.isPublic = true ORDER BY c.sortOrder")
    List<Collection> findAllPublicCollections();

    // 📦 Tìm kèm số bookmark
    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.bookmarks WHERE c.user = :user ORDER BY c.sortOrder")
    List<Collection> findByUserWithBookmarks(@Param("user") User user);

    // 📊 Tổng số bookmark trong tất cả collection của user
    @Query("SELECT COUNT(b) FROM Collection c JOIN c.bookmarks b WHERE c.user = :user")
    long countTotalBookmarksByUser(@Param("user") User user);
}
