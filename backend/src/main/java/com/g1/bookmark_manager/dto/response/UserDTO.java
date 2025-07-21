package com.g1.bookmark_manager.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
    private List<String> roles;
}