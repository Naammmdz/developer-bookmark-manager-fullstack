package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.request.CodeBlockRequest;
import com.g1.bookmark_manager.dto.response.CodeBlockResponse;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.service.CodeBlockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/codeblocks")
@Tag(name = "CodeBlock Management", description = "APIs for managing code blocks")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeBlockController {
    
    @Autowired
    private CodeBlockService codeBlockService;
    
    @PostMapping
    @Operation(summary = "Create a new code block")
    public ResponseEntity<CodeBlockResponse> createCodeBlock(
            @Valid @RequestBody CodeBlockRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CodeBlockResponse response = codeBlockService.createCodeBlock(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    @Operation(summary = "Get all code blocks for the authenticated user")
    public ResponseEntity<List<CodeBlockResponse>> getAllCodeBlocks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CodeBlockResponse> codeBlocks = codeBlockService.getAllCodeBlocks(user);
        return ResponseEntity.ok(codeBlocks);
    }
    
    @GetMapping("/collection/{collection}")
    @Operation(summary = "Get code blocks by collection")
    public ResponseEntity<List<CodeBlockResponse>> getCodeBlocksByCollection(
            @PathVariable String collection,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CodeBlockResponse> codeBlocks = codeBlockService.getCodeBlocksByCollection(user, collection);
        return ResponseEntity.ok(codeBlocks);
    }
    
    @GetMapping("/favorites")
    @Operation(summary = "Get favorite code blocks")
    public ResponseEntity<List<CodeBlockResponse>> getFavoriteCodeBlocks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CodeBlockResponse> codeBlocks = codeBlockService.getFavoriteCodeBlocks(user);
        return ResponseEntity.ok(codeBlocks);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get code block by ID")
    public ResponseEntity<CodeBlockResponse> getCodeBlockById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CodeBlockResponse codeBlock = codeBlockService.getCodeBlockById(id, user);
        return ResponseEntity.ok(codeBlock);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a code block")
    public ResponseEntity<CodeBlockResponse> updateCodeBlock(
            @PathVariable Long id,
            @Valid @RequestBody CodeBlockRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CodeBlockResponse response = codeBlockService.updateCodeBlock(id, request, user);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a code block")
    public ResponseEntity<Void> deleteCodeBlock(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        codeBlockService.deleteCodeBlock(id, user);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/favorite")
    @Operation(summary = "Toggle favorite status of a code block")
    public ResponseEntity<CodeBlockResponse> toggleFavorite(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CodeBlockResponse response = codeBlockService.toggleFavorite(id, user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search code blocks")
    public ResponseEntity<List<CodeBlockResponse>> searchCodeBlocks(
            @RequestParam String q,
            @RequestParam(required = false) String collection,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CodeBlockResponse> codeBlocks;
        
        if (collection != null && !collection.isEmpty()) {
            codeBlocks = codeBlockService.searchCodeBlocksByCollection(user, collection, q);
        } else {
            codeBlocks = codeBlockService.searchCodeBlocks(user, q);
        }
        
        return ResponseEntity.ok(codeBlocks);
    }
    
    @GetMapping("/language/{language}")
    @Operation(summary = "Get code blocks by programming language")
    public ResponseEntity<List<CodeBlockResponse>> getCodeBlocksByLanguage(
            @PathVariable String language,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CodeBlockResponse> codeBlocks = codeBlockService.getCodeBlocksByLanguage(user, language);
        return ResponseEntity.ok(codeBlocks);
    }
    
    @GetMapping("/collections")
    @Operation(summary = "Get distinct collections used by user")
    public ResponseEntity<List<String>> getDistinctCollections(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<String> collections = codeBlockService.getDistinctCollections(user);
        return ResponseEntity.ok(collections);
    }
    
    @GetMapping("/collection/{collection}/count")
    @Operation(summary = "Get code block count for a collection")
    public ResponseEntity<Long> getCodeBlockCountByCollection(
            @PathVariable String collection,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long count = codeBlockService.getCodeBlockCountByCollection(user, collection);
        return ResponseEntity.ok(count);
    }
}
