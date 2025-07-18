package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.CodeBlock;
import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeBlockRepository extends JpaRepository<CodeBlock, Long> {
    
    List<CodeBlock> findByUserOrderByCreatedAtDesc(User user);
    
    List<CodeBlock> findByUserAndCollectionOrderByCreatedAtDesc(User user, String collection);
    
    List<CodeBlock> findByUserAndIsFavoriteOrderByCreatedAtDesc(User user, Boolean isFavorite);
    
    Optional<CodeBlock> findByIdAndUser(Long id, User user);
    
    @Query("SELECT c FROM CodeBlock c WHERE c.user = :user AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.language) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<CodeBlock> findByUserAndSearchTerm(@Param("user") User user, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT c FROM CodeBlock c WHERE c.user = :user AND c.collection = :collection AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.language) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<CodeBlock> findByUserAndCollectionAndSearchTerm(@Param("user") User user, 
                                                        @Param("collection") String collection, 
                                                        @Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(c) FROM CodeBlock c WHERE c.user = :user AND c.collection = :collection")
    Long countByUserAndCollection(@Param("user") User user, @Param("collection") String collection);
    
    @Query("SELECT DISTINCT c.collection FROM CodeBlock c WHERE c.user = :user AND c.collection IS NOT NULL")
    List<String> findDistinctCollectionsByUser(@Param("user") User user);
    
    List<CodeBlock> findByUserAndLanguageOrderByCreatedAtDesc(User user, String language);
}
