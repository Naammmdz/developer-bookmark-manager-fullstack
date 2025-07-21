package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.response.UserDTO;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.UserRepository;
import com.g1.bookmark_manager.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin-only APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService adminService;

    public AdminController(UserRepository userRepository, AdminService adminService) {
        this.userRepository = userRepository;
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Admin dashboard (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Welcome to Admin Dashboard! You have ADMIN privileges.");
    }

    // Handling user deactivation
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        try {
            adminService.softDeleteUser(id);
            return ResponseEntity.ok("User deactivated successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
