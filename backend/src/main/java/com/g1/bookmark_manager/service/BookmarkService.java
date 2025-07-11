package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.dto.response.BookmarkResponse;
import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

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
        bookmark.setCollection(request.getCollection());
        bookmark.setTags(request.getTags());
        bookmark.setIsFavorite(request.getIsFavorite());
        bookmark.setIsPublic(request.getIsPublic());
        bookmark.setFavicon(request.getFavicon());
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
        bookmark.setCollection(request.getCollection());
        bookmark.setTags(request.getTags());
        bookmark.setIsFavorite(request.getIsFavorite());
        bookmark.setIsPublic(request.getIsPublic());
        bookmark.setFavicon(request.getFavicon());

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

    public BookmarkResponse patchBookmark(Long id, Map<String, Object> updates, String username) {
        User user = authService.findByUsername(username);
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found with id: " + id));

        if (!bookmark.getUser().equals(user)) {
            throw new ResourceNotFoundException("Bookmark not found or access denied");
        }

        // Apply partial updates
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            switch (key) {
                case "isFavorite":
                    bookmark.setIsFavorite((Boolean) value);
                    break;
                case "isPublic":
                    bookmark.setIsPublic((Boolean) value);
                    break;
                case "title":
                    bookmark.setTitle((String) value);
                    break;
                case "description":
                    bookmark.setDescription((String) value);
                    break;
                case "collection":
                    bookmark.setCollection((String) value);
                    break;
                case "tags":
                    bookmark.setTags((List<String>) value);
                    break;
                case "favicon":
                    bookmark.setFavicon((String) value);
                    break;
            }
        }

        bookmark = bookmarkRepository.save(bookmark);
        return convertToResponse(bookmark);
    }

    public List<BookmarkResponse> getFavoriteBookmarks(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndIsFavoriteTrue(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getBookmarksByCollection(String collection, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndCollection(user, collection)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getPublicBookmarks(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndIsPublicTrue(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getAllPublicBookmarks() {
        return bookmarkRepository.findByIsPublicTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getBookmarksByTag(String tag, String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findByUserAndTagsContaining(user, tag)
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

    public List<String> getCollections(String username) {
        User user = authService.findByUsername(username);
        return bookmarkRepository.findDistinctCollectionsByUser(user);
    }

    private BookmarkResponse convertToResponse(Bookmark bookmark) {
        return new BookmarkResponse(
                bookmark.getId(),
                bookmark.getTitle(),
                bookmark.getUrl(),
                bookmark.getDescription(),
                bookmark.getCollection(),
                bookmark.getTags(),
                bookmark.getIsFavorite(),
                bookmark.getIsPublic(),
                bookmark.getFavicon(),
                bookmark.getCreatedAt(),
                bookmark.getUpdatedAt(),
                bookmark.getUser().getUsername()
        );
    }

    // filter theo specification
    public List<BookmarkResponse> filterBookmarks(String title, String url, Boolean isFavorite, String tag, String sortBy) {
        Specification<Bookmark> spec = (root, query, cb) -> cb.conjunction();
        // Đoạn code trên tạo một Specification cơ bản mà không có điều kiện nào.
        if (title != null && !title.isEmpty()) {
            spec = spec.and(((root, query, cb)
                    -> cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%")));
        }
        if (url != null && !url.isEmpty()) {
            spec = spec.and(((root, query, cb)
                    -> cb.like(cb.lower(root.get("url")), "%" + url.toLowerCase() + "%")));
        }
        if (isFavorite != null) {
            spec = spec.and(((root, query, cb)
                    -> cb.equal(root.get("isFavorite"), isFavorite)));
        }
        if (tag != null && !tag.isEmpty()) {
            spec = spec.and(((root, query, cb)
                    -> cb.isMember(tag, root.get("tags"))));
        }
        String[] sortDetails = sortBy.split(",");
        String sortByProperty = sortDetails[0];
        Sort.Direction sortDirection = Sort.Direction.ASC;
        boolean isDescending = sortDetails.length > 1 && "desc".equalsIgnoreCase(sortDetails[1]);
        if (isDescending) {
            sortDirection = Sort.Direction.DESC;
        }
        Sort sort = Sort.by(sortDirection, sortByProperty);
        List<Bookmark> bookmarks = bookmarkRepository.findAll(spec, sort);
        return bookmarks
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

    }


}
