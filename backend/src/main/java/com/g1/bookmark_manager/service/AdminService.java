package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.response.UserDTO;
import com.g1.bookmark_manager.entity.Role;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .isActive(user.getIsActive()) // Changed from isActive() to getIsActive()
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name()) // Convert RoleName enum to String
                        .collect(Collectors.toList()))
                .build();
    }

    // Handling user deactivation
    /**
     * Soft delete a user by setting isActive to false.
     * This method is used by the admin to deactivate a user account.
     *
     * @param id the ID of the user to be deactivated
     */
    public void softDeleteUser(Long id) {
        // Check if the user exists
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        // Handling user deactivation
        // Ensure the user is not already inactive
        if (!user.getIsActive()) {
            user.setIsActive(true);
            userRepository.save(user);
        } else {
            user.setIsActive(false);
            userRepository.save(user);
        }
    }
}
