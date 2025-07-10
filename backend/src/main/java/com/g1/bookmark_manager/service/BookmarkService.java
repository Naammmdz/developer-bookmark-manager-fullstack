package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.dto.response.BookmarkResponse;
import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private AuthService authService;

    public List<BookmarkResponse> getAllBookmarks(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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
        bookmark.setCategory(request.getCategory());
        bookmark.setTags(request.getTags());
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
        bookmark.setCategory(request.getCategory());
        bookmark.setTags(request.getTags());
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

    public List<BookmarkResponse> getFavoriteBookmarks(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndIsFavoriteTrue(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getBookmarksByCategory(String category, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndCategory(user, category)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> searchBookmarks(String keyword, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.searchBookmarks(user, keyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<String> getCategories(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findDistinctCategoriesByUser(user);
    }

    private BookmarkResponse convertToResponse(Bookmark bookmark) {
        return new BookmarkResponse(
                bookmark.getId(),
                bookmark.getTitle(),
                bookmark.getUrl(),
                bookmark.getDescription(),
                bookmark.getCategory(),
                bookmark.getTags(),
                bookmark.getIsFavorite(),
                bookmark.getCreatedAt(),
                bookmark.getUpdatedAt(),
                bookmark.getUser().getUsername()
        );
    }
}
