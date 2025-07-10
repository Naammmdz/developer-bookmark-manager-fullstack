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
    @Operation(summary = "Get all bookmarks for the current user")
    public ResponseEntity<List<BookmarkResponse>> getAllBookmarks() {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getAllBookmarks(username);
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
    @Operation(summary = "Get favorite bookmarks")
    public ResponseEntity<List<BookmarkResponse>> getFavoriteBookmarks() {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getFavoriteBookmarks(username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get bookmarks by category")
    public ResponseEntity<List<BookmarkResponse>> getBookmarksByCategory(@PathVariable String category) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getBookmarksByCategory(category, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/search")
    @Operation(summary = "Search bookmarks")
    public ResponseEntity<List<BookmarkResponse>> searchBookmarks(@RequestParam String keyword) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.searchBookmarks(keyword, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories for the current user")
    public ResponseEntity<List<String>> getCategories() {
        String username = getCurrentUsername();
        List<String> categories = bookmarkService.getCategories(username);
        return ResponseEntity.ok(categories);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
