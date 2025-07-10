package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.entity.Role;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.repository.RoleRepository;
import com.g1.bookmark_manager.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DataInitializationService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializationService(RoleRepository roleRepository, 
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void initializeDefaultData() {
        initializeRoles();
        initializeAdminUser();
    }

    private void initializeRoles() {
        // Tạo role USER nếu chưa tồn tại
        if (!roleRepository.existsByName(Role.RoleName.USER)) {
            Role userRole = new Role();
            userRole.setName(Role.RoleName.USER);
            userRole.setDescription("Default user role");
            roleRepository.save(userRole);
        }

        // Tạo role ADMIN nếu chưa tồn tại
        if (!roleRepository.existsByName(Role.RoleName.ADMIN)) {
            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ADMIN);
            adminRole.setDescription("Administrator role");
            roleRepository.save(adminRole);
        }
    }

    private void initializeAdminUser() {
        // Tạo admin user mặc định nếu chưa tồn tại
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
            
            Role userRole = roleRepository.findByName(Role.RoleName.USER)
                    .orElseThrow(() -> new RuntimeException("USER role not found"));

            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@bookmarkmanager.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFullName("System Administrator");
            adminUser.setIsActive(true);
            
            // Admin có cả 2 roles: USER và ADMIN
            adminUser.setRoles(List.of(userRole, adminRole));
            
            userRepository.save(adminUser);
            
            System.out.println("✅ Default admin user created:");
            System.out.println("   Username: admin");
            System.out.println("   Password: admin123");
            System.out.println("   Email: admin@bookmarkmanager.com");
        }
    }
}
