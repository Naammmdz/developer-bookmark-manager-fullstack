package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.request.CollectionRequest;
import com.g1.bookmark_manager.dto.response.CollectionResponse;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.service.CollectionService;
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
@RequestMapping("/api/collections")
@Tag(name = "Collections", description = "Collection management endpoints")
public class CollectionController {

    private final CollectionService collectionService;

    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping
    @Operation(summary = "Create a new collection")
    public ResponseEntity<CollectionResponse> createCollection(
            @Valid @RequestBody CollectionRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CollectionResponse response = collectionService.createCollection(user.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all collections for the current user")
    public ResponseEntity<List<CollectionResponse>> getAllCollections(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CollectionResponse> collections = collectionService.getAllCollections(user.getId());
        return ResponseEntity.ok(collections);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a collection")
    public ResponseEntity<CollectionResponse> updateCollection(
            @PathVariable Long id,
            @Valid @RequestBody CollectionRequest request) {
        CollectionResponse response = collectionService.updateCollection(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a collection")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }
}
