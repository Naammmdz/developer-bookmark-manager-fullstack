package com.g1.bookmark_manager.repository;

import com.g1.bookmark_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    @Query("SELECT u.fullName FROM User u WHERE u.username = ?1")
    String findNameByUserName(String username);
    @Query("SELECT u.email FROM User u WHERE u.username = ?1")
    String findEmailByUserName(String username);
}
