package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.request.LoginRequest;
import com.g1.bookmark_manager.dto.request.RegisterRequest;
import com.g1.bookmark_manager.dto.request.UpdateUserRequest;
import com.g1.bookmark_manager.dto.request.ChangePasswordRequest;
import com.g1.bookmark_manager.dto.response.AuthResponse;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.service.AuthService;
import com.g1.bookmark_manager.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/{token}")
    @Operation(summary = "Get current user details")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = authService.findByUsername(username);
        AuthResponse response = new AuthResponse(jwtUtil.generateToken(user), user.getUsername(), user.getEmail(), user.getFullName());
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<AuthResponse> updateProfile(Authentication authentication, @Valid @RequestBody UpdateUserRequest request) {
        String username = authentication.getName();
        User updatedUser = authService.updateUser(username, request);
        // Generate new token with updated user information
        String newToken = jwtUtil.generateToken(updatedUser);
        AuthResponse response = new AuthResponse(newToken, updatedUser.getUsername(), updatedUser.getEmail(), updatedUser.getFullName());
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/change-password")
    @Operation(summary = "Change current user password")
    public ResponseEntity<String> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        String username = authentication.getName();
        authService.changePassword(username, request);
        return ResponseEntity.ok("Password changed successfully");
    }
}
