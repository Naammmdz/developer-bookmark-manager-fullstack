package com.g1.bookmark_manager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Bookmark Manager API!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "Service is running!";
    }
}
