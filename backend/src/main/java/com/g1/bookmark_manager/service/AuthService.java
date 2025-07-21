package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.LoginRequest;
import com.g1.bookmark_manager.dto.request.RegisterRequest;
import com.g1.bookmark_manager.dto.request.UpdateUserRequest;
import com.g1.bookmark_manager.dto.request.ChangePasswordRequest;
import com.g1.bookmark_manager.dto.response.AuthResponse;
import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.Role;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.enums.AuditAction;
import com.g1.bookmark_manager.exception.DuplicateResourceException;
import com.g1.bookmark_manager.exception.InvalidDataException;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.CollectionRepository;
import com.g1.bookmark_manager.repository.RoleRepository;
import com.g1.bookmark_manager.repository.UserRepository;
import com.g1.bookmark_manager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CollectionRepository collectionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       CollectionRepository collectionRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.collectionRepository = collectionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        Role userRole = roleRepository.findByName(Role.RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Default USER role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRoles(List.of(userRole));

        userRepository.save(user);
        createDefaultCollections(user);

        auditLogService.log(user.getId(), AuditAction.REGISTER, "Người dùng đăng ký mới: " + user.getUsername());

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getFullName());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getPassword() == null) {
                throw new InvalidDataException("Username and password must not be null");
            }

            if (request.getUsername().contains("@")) {
                User user = userRepository.findByEmail(request.getUsername())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getUsername()));
                request.setUsername(user.getUsername());
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            auditLogService.log(user.getId(), AuditAction.LOGIN, "Đăng nhập thành công: " + user.getUsername());

            String token = jwtUtil.generateToken(user);
            return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getFullName());

        } catch (Exception e) {
            throw new InvalidDataException("Invalid username/email or password");
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    public AuthResponse getCurrentUser(String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        User user = findByUsername(username);
        return new AuthResponse(jwtUtil.generateToken(user), user.getUsername(), user.getEmail(), user.getFullName());
    }

    public User updateUser(String username, UpdateUserRequest request) {
        User user = findByUsername(username);

        if (!user.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        auditLogService.log(user.getId(), AuditAction.UPDATE_PROFILE, "Cập nhật hồ sơ người dùng");

        return userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = findByUsername(username);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidDataException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.log(user.getId(), AuditAction.CHANGE_PASSWORD, "Người dùng đổi mật khẩu");
    }

    private void createDefaultCollections(User user) {
        String[][] defaultCollections = {
                {"Frontend Resources", "Layers", "Resources for frontend development"},
                {"Backend Resources", "Server", "Resources for backend development"},
                {"CSS Resources", "Palette", "Stylesheets and design resources"},
                {"Documentation", "FileText", "Documentation and reference materials"}
        };

        for (int i = 0; i < defaultCollections.length; i++) {
            String[] data = defaultCollections[i];
            Collection collection = new Collection();
            collection.setName(data[0]);
            collection.setIcon(data[1]);
            collection.setDescription(data[2]);
            collection.setIsPublic(true);
            collection.setIsDefault(true);
            collection.setSortOrder(i + 1);
            collection.setUser(user);

            collectionRepository.save(collection);
        }
    }
}

