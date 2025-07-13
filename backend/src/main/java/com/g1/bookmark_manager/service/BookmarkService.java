package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.dto.response.BookmarkResponse;
import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private AuthService authService;
    
    @Autowired
    private CollectionRepository collectionRepository;

    public Page<BookmarkResponse> getAllBookmarks(String username, Pageable pageable) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user, pageable)
                .map(this::convertToResponse);
    }

    public BookmarkResponse getBookmarkById(Long id, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        return convertToResponse(bookmark);
    }

    public BookmarkResponse createBookmark(BookmarkRequest request, String username) {
        User user = authService.findByUsername(username);
        
        Bookmark bookmark = new Bookmark();
        bookmark.setTitle(request.getTitle());
        bookmark.setUrl(request.getUrl());
        bookmark.setDescription(request.getDescription());
        // Convert tags string to list if needed
        if (request.getTags() != null && !request.getTags().trim().isEmpty()) {
            bookmark.setTags(List.of(request.getTags().split(",")));
        }
        bookmark.setIsFavorite(request.getIsFavorite());
        bookmark.setUser(user);
        
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }

    public BookmarkResponse updateBookmark(Long id, BookmarkRequest request, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        bookmark.setTitle(request.getTitle());
        bookmark.setUrl(request.getUrl());
        bookmark.setDescription(request.getDescription());
        // Convert tags string to list if needed
        if (request.getTags() != null && !request.getTags().trim().isEmpty()) {
            bookmark.setTags(List.of(request.getTags().split(",")));
        }
        bookmark.setIsFavorite(request.getIsFavorite());
        
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }

    public void deleteBookmark(Long id, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        bookmarkRepository.delete(bookmark);
    }

    public Page<BookmarkResponse> getFavoriteBookmarks(String username, Pageable pageable) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndIsFavoriteTrue(user, pageable)
                .map(this::convertToResponse);
    }

    public List<BookmarkResponse> searchBookmarks(String keyword, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.searchBookmarks(user, keyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Collection-related methods
    public Page<BookmarkResponse> getBookmarksByCollection(Long collectionId, String username, Pageable pageable) {
        User user = authService.findByUsername(username);
        com.g1.bookmark_manager.entity.Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));
        
        if (!collection.isOwnedBy(user)) {
            throw new ResourceNotFoundException("Collection not found or access denied");
        }
        
        return bookmarkRepository.findByUserAndCollection(user, collection, pageable)
                .map(this::convertToResponse);
    }
    
    public Page<BookmarkResponse> getUncategorizedBookmarks(String username, Pageable pageable) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndCollectionIsNull(user, pageable)
                .map(this::convertToResponse);
    }

    private BookmarkResponse convertToResponse(Bookmark bookmark) {
        String tagsString = bookmark.getTags() != null ? 
                String.join(",", bookmark.getTags()) : "";
        return new BookmarkResponse(
                bookmark.getId(),
                bookmark.getTitle(),
                bookmark.getUrl(),
                bookmark.getDescription(),
                null, // category field removed from entity
                tagsString,
                bookmark.getIsFavorite(),
                bookmark.getCreatedAt(),
                bookmark.getUpdatedAt(),
                bookmark.getUser().getUsername()
        );
    }
}
