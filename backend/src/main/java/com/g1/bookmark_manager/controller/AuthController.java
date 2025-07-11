package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.request.LoginRequest;
import com.g1.bookmark_manager.dto.request.RegisterRequest;
import com.g1.bookmark_manager.dto.response.AuthResponse;
import com.g1.bookmark_manager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

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
    public ResponseEntity<AuthResponse> getCurrentUser(@PathVariable String token) {
        AuthResponse response = authService.getCurrentUser(token);
        return ResponseEntity.ok(response);
    }
}
