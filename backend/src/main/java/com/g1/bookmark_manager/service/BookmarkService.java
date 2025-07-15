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
        bookmark.setIsFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false);
        bookmark.setUser(user);
        bookmark.setIsPublic(false); // Default to private
        bookmark.setClickCount(0);
        
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }
    
    public BookmarkResponse createBookmarkWithCollection(BookmarkRequest request, Long collectionId, String username) {
        User user = authService.findByUsername(username);
        
        Bookmark bookmark = new Bookmark();
        bookmark.setTitle(request.getTitle());
        bookmark.setUrl(request.getUrl());
        bookmark.setDescription(request.getDescription());
        // Convert tags string to list if needed
        if (request.getTags() != null && !request.getTags().trim().isEmpty()) {
            bookmark.setTags(List.of(request.getTags().split(",")));
        }
        bookmark.setIsFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false);
        bookmark.setUser(user);
        bookmark.setIsPublic(false); // Default to private
        bookmark.setClickCount(0);
        
        if (collectionId != null) {
            com.g1.bookmark_manager.entity.Collection collection = collectionRepository.findById(collectionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));
            
            if (!collection.isOwnedBy(user)) {
                throw new ResourceNotFoundException("Collection not found or access denied");
            }
            
            bookmark.setCollection(collection);
        }
        
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
    
    public BookmarkResponse toggleFavorite(Long id, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        bookmark.toggleFavorite();
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }
    
    public BookmarkResponse recordClick(Long id, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        bookmark.incrementClickCount();
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }
    
    public BookmarkResponse moveToCollection(Long bookmarkId, Long collectionId, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + bookmarkId));
        
        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }
        
        if (collectionId != null) {
            com.g1.bookmark_manager.entity.Collection collection = collectionRepository.findById(collectionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));
            
            if (!collection.isOwnedBy(user)) {
                throw new ResourceNotFoundException("Collection not found or access denied");
            }
            
            bookmark.setCollection(collection);
        } else {
            bookmark.setCollection(null);
        }
        
        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }
    
    public List<BookmarkResponse> getBookmarksByTag(String tag, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user)
                .stream()
                .filter(bookmark -> bookmark.getTags() != null && bookmark.getTags().contains(tag))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getUserTags(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user)
                .stream()
                .filter(bookmark -> bookmark.getTags() != null)
                .flatMap(bookmark -> bookmark.getTags().stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    public Page<BookmarkResponse> getRecentBookmarks(String username, Pageable pageable) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user, pageable)
                .map(this::convertToResponse);
    }
    
    public List<BookmarkResponse> getDuplicateBookmarks(String username) {
        User user = authService.findByUsername(username);
        List<Bookmark> allBookmarks = bookmarkRepository.findByUser(user);
        
        return allBookmarks.stream()
                .collect(Collectors.groupingBy(Bookmark::getUrl))
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue().size() > 1)
                .flatMap(entry -> entry.getValue().stream())
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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
                bookmark.getCollection() != null ? bookmark.getCollection().getName() : null,
                tagsString,
                bookmark.getIsFavorite(),
                bookmark.getCreatedAt(),
                bookmark.getUpdatedAt(),
                bookmark.getUser().getUsername()
        );
    }
    
    // Additional utility methods
    public long getBookmarkCount(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user).size();
    }
    
    public long getFavoriteCount(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndIsFavoriteTrue(user).size();
    }
    
    public List<BookmarkResponse> getBookmarksWithoutTags(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user)
                .stream()
                .filter(bookmark -> bookmark.getTags() == null || bookmark.getTags().isEmpty())
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<BookmarkResponse> getMostClickedBookmarks(String username, int limit) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUser(user)
                .stream()
                .sorted((b1, b2) -> Integer.compare(
                        b2.getClickCount() != null ? b2.getClickCount() : 0,
                        b1.getClickCount() != null ? b1.getClickCount() : 0
                ))
                .limit(limit)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}
