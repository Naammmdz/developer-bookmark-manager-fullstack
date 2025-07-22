package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.repository.UserRepository;
import com.g1.bookmark_manager.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test")
public class CommonController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MailService mailService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Bookmark Manager API!";
    }

    @GetMapping("/health")
    public String health() {
        return "Service is running!";
    }

    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(
            @RequestParam(required = false) MultipartFile[] files,
            Authentication authentication) {
        String authUsername = authentication.getName();
        String name = userRepository.findNameByUserName(authUsername);
        String email = userRepository.findEmailByUserName(authUsername);
        return ResponseEntity.ok(mailService.sendEmail(email,"", authUsername, name,"", files));

    }
}
