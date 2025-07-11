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
import java.util.Map;

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

    @PatchMapping("/{id}")
    @Operation(summary = "Partially update a bookmark")
    public ResponseEntity<BookmarkResponse> patchBookmark(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        String username = getCurrentUsername();
        BookmarkResponse bookmark = bookmarkService.patchBookmark(id, updates, username);
        return ResponseEntity.ok(bookmark);
    }

    @GetMapping("/favorites")
    @Operation(summary = "Get favorite bookmarks")
    public ResponseEntity<List<BookmarkResponse>> getFavoriteBookmarks() {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getFavoriteBookmarks(username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/collection/{collection}")
    @Operation(summary = "Get bookmarks by collection")
    public ResponseEntity<List<BookmarkResponse>> getBookmarksByCollection(@PathVariable String collection) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getBookmarksByCollection(collection, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/public")
    @Operation(summary = "Get public bookmarks for the current user")
    public ResponseEntity<List<BookmarkResponse>> getPublicBookmarks() {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getPublicBookmarks(username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/public/all")
    @Operation(summary = "Get all public bookmarks")
    public ResponseEntity<List<BookmarkResponse>> getAllPublicBookmarks() {
        List<BookmarkResponse> bookmarks = bookmarkService.getAllPublicBookmarks();
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/tag/{tag}")
    @Operation(summary = "Get bookmarks by tag")
    public ResponseEntity<List<BookmarkResponse>> getBookmarksByTag(@PathVariable String tag) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.getBookmarksByTag(tag, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/search")
    @Operation(summary = "Search bookmarks")
    public ResponseEntity<List<BookmarkResponse>> searchBookmarks(@RequestParam String keyword) {
        String username = getCurrentUsername();
        List<BookmarkResponse> bookmarks = bookmarkService.searchBookmarks(keyword, username);
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/collections")
    @Operation(summary = "Get all collections for the current user")
    public ResponseEntity<List<String>> getCollections() {
        String username = getCurrentUsername();
        List<String> collections = bookmarkService.getCollections(username);
        return ResponseEntity.ok(collections);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @GetMapping("/filterResult")
    // (String title, String url, Boolean isFavorite, String tag, String sortBy)
    @Operation(summary = "Filter bookmarks by various criteria")
    public ResponseEntity<List<BookmarkResponse>> filterBookmarks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) Boolean isFavorite,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String sortBy
    ) {

        List<BookmarkResponse> bookmarks = bookmarkService.filterBookmarks(title, url, isFavorite, tag, sortBy);
        return ResponseEntity.ok(bookmarks);
    }
}
