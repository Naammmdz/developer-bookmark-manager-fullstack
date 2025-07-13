package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.dto.response.BookmarkResponse;
import com.g1.bookmark_manager.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@Tag(name = "Bookmarks", description = "Bookmark management API")
@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
public class BookmarkController {

    @Autowired
    private BookmarkService bookmarkService;

    @GetMapping
    @Operation(summary = "Get all bookmarks for the current user with pagination")
    public ResponseEntity<Page<BookmarkResponse>> getAllBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        String username = getCurrentUsername();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<BookmarkResponse> bookmarks = bookmarkService.getAllBookmarks(username, pageable);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get bookmark by ID")
    public ResponseEntity<BookmarkResponse> getBookmarkById(@PathVariable Long id) {
        String username = getCurrentUsername();
        BookmarkResponse bookmark = bookmarkService.getBookmarkById(id, username);
        return ResponseEntity.ok(bookmark);
    }

    @PostMapping
    @Operation(summary = "Create a new bookmark")
    public ResponseEntity<BookmarkResponse> createBookmark(@Valid @RequestBody BookmarkRequest request) {
        String username = getCurrentUsername();
        BookmarkResponse bookmark = bookmarkService.createBookmark(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmark);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing bookmark")
    public ResponseEntity<BookmarkResponse> updateBookmark(@PathVariable Long id, @Valid @RequestBody BookmarkRequest request) {
        String username = getCurrentUsername();
        BookmarkResponse bookmark = bookmarkService.updateBookmark(id, request, username);
        return ResponseEntity.ok(bookmark);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a bookmark")
    public ResponseEntity<Void> deleteBookmark(@PathVariable Long id) {
        String username = getCurrentUsername();
        bookmarkService.deleteBookmark(id, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    @Operation(summary = "Get favorite bookmarks with pagination")
    public ResponseEntity<Page<BookmarkResponse>> getFavoriteBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        String username = getCurrentUsername();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<BookmarkResponse> bookmarks = bookmarkService.getFavoriteBookmarks(username, pageable);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/search")
    @Operation(summary = "Search bookmarks")
    public ResponseEntity<List<BookmarkResponse>> searchBookmarks(@RequestParam String keyword) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.searchBookmarks(keyword, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/collection/{collectionId}")
    @Operation(summary = "Get bookmarks by collection with pagination")
    public ResponseEntity<Page<BookmarkResponse>> getBookmarksByCollection(
            @PathVariable Long collectionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        String username = getCurrentUsername();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<BookmarkResponse> bookmarks = bookmarkService.getBookmarksByCollection(collectionId, username, pageable);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/uncategorized")
    @Operation(summary = "Get uncategorized bookmarks with pagination")
    public ResponseEntity<Page<BookmarkResponse>> getUncategorizedBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        String username = getCurrentUsername();
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<BookmarkResponse> bookmarks = bookmarkService.getUncategorizedBookmarks(username, pageable);
        return ResponseEntity.ok(bookmarks);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
