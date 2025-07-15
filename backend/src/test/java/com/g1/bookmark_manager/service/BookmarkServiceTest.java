package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.dto.response.BookmarkResponse;
import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.Collection;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.exception.ResourceNotFoundException;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.repository.CollectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookmarkServiceTest {

    @Mock
    private BookmarkRepository bookmarkRepository;

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private BookmarkService bookmarkService;

    private User testUser;
    private Bookmark testBookmark;
    private Collection testCollection;
    private BookmarkRequest testRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testCollection = new Collection();
        testCollection.setId(1L);
        testCollection.setName("Test Collection");
        testCollection.setUser(testUser);

        testBookmark = new Bookmark();
        testBookmark.setId(1L);
        testBookmark.setTitle("Test Bookmark");
        testBookmark.setUrl("https://example.com");
        testBookmark.setDescription("Test description");
        testBookmark.setTags(Arrays.asList("tag1", "tag2"));
        testBookmark.setIsFavorite(false);
        testBookmark.setUser(testUser);
        testBookmark.setCreatedAt(LocalDateTime.now());
        testBookmark.setUpdatedAt(LocalDateTime.now());
        testBookmark.setClickCount(0);

        testRequest = new BookmarkRequest();
        testRequest.setTitle("Test Bookmark");
        testRequest.setUrl("https://example.com");
        testRequest.setDescription("Test description");
        testRequest.setTags("tag1,tag2");
        testRequest.setIsFavorite(false);
    }

    @Test
    void getAllBookmarks_ShouldReturnPageOfBookmarks() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Bookmark> bookmarkPage = new PageImpl<>(Arrays.asList(testBookmark));
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser, pageable)).thenReturn(bookmarkPage);

        // When
        Page<BookmarkResponse> result = bookmarkService.getAllBookmarks("testuser", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Bookmark", result.getContent().get(0).getTitle());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser, pageable);
    }

    @Test
    void getBookmarkById_ShouldReturnBookmark_WhenFoundAndOwned() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));

        // When
        BookmarkResponse result = bookmarkService.getBookmarkById(1L, "testuser");

        // Then
        assertNotNull(result);
        assertEquals("Test Bookmark", result.getTitle());
        assertEquals("https://example.com", result.getUrl());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
    }

    @Test
    void getBookmarkById_ShouldThrowException_WhenNotFound() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
            () -> bookmarkService.getBookmarkById(1L, "testuser"));
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
    }

    @Test
    void getBookmarkById_ShouldThrowException_WhenNotOwned() {
        // Given
        User anotherUser = new User();
        anotherUser.setId(2L);
        anotherUser.setUsername("anotheruser");
        
        testBookmark.setUser(anotherUser);
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
            () -> bookmarkService.getBookmarkById(1L, "testuser"));
    }

    @Test
    void createBookmark_ShouldCreateAndReturnBookmark() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.createBookmark(testRequest, "testuser");

        // Then
        assertNotNull(result);
        assertEquals("Test Bookmark", result.getTitle());
        assertEquals("https://example.com", result.getUrl());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void createBookmarkWithCollection_ShouldCreateBookmarkInCollection() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(collectionRepository.findById(1L)).thenReturn(Optional.of(testCollection));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.createBookmarkWithCollection(testRequest, 1L, "testuser");

        // Then
        assertNotNull(result);
        assertEquals("Test Bookmark", result.getTitle());
        
        verify(authService).findByUsername("testuser");
        verify(collectionRepository).findById(1L);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void updateBookmark_ShouldUpdateAndReturnBookmark() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.updateBookmark(1L, testRequest, "testuser");

        // Then
        assertNotNull(result);
        assertEquals("Test Bookmark", result.getTitle());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void deleteBookmark_ShouldDeleteBookmark() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));

        // When
        bookmarkService.deleteBookmark(1L, "testuser");

        // Then
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
        verify(bookmarkRepository).delete(testBookmark);
    }

    @Test
    void toggleFavorite_ShouldToggleFavoriteStatus() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.toggleFavorite(1L, "testuser");

        // Then
        assertNotNull(result);
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void recordClick_ShouldIncrementClickCount() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.recordClick(1L, "testuser");

        // Then
        assertNotNull(result);
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void getFavoriteBookmarks_ShouldReturnFavoriteBookmarks() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        testBookmark.setIsFavorite(true);
        Page<Bookmark> bookmarkPage = new PageImpl<>(Arrays.asList(testBookmark));
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUserAndIsFavoriteTrue(testUser, pageable)).thenReturn(bookmarkPage);

        // When
        Page<BookmarkResponse> result = bookmarkService.getFavoriteBookmarks("testuser", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).getIsFavorite());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUserAndIsFavoriteTrue(testUser, pageable);
    }

    @Test
    void searchBookmarks_ShouldReturnMatchingBookmarks() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.searchBookmarks(testUser, "test")).thenReturn(Arrays.asList(testBookmark));

        // When
        List<BookmarkResponse> result = bookmarkService.searchBookmarks("test", "testuser");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Bookmark", result.get(0).getTitle());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).searchBookmarks(testUser, "test");
    }

    @Test
    void getBookmarksByTag_ShouldReturnBookmarksWithTag() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When
        List<BookmarkResponse> result = bookmarkService.getBookmarksByTag("tag1", "testuser");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getTags().contains("tag1"));
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }

    @Test
    void getUserTags_ShouldReturnAllUserTags() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When
        List<String> result = bookmarkService.getUserTags("testuser");

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains("tag1"));
        assertTrue(result.contains("tag2"));
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }

    @Test
    void getBookmarkCount_ShouldReturnTotalBookmarkCount() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When
        long result = bookmarkService.getBookmarkCount("testuser");

        // Then
        assertEquals(1, result);
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }

    @Test
    void getFavoriteCount_ShouldReturnFavoriteBookmarkCount() {
        // Given
        testBookmark.setIsFavorite(true);
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUserAndIsFavoriteTrue(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When
        long result = bookmarkService.getFavoriteCount("testuser");

        // Then
        assertEquals(1, result);
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUserAndIsFavoriteTrue(testUser);
    }

    @Test
    void moveToCollection_ShouldMoveBookmarkToCollection() {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(collectionRepository.findById(1L)).thenReturn(Optional.of(testCollection));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When
        BookmarkResponse result = bookmarkService.moveToCollection(1L, 1L, "testuser");

        // Then
        assertNotNull(result);
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findById(1L);
        verify(collectionRepository).findById(1L);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void getDuplicateBookmarks_ShouldReturnDuplicateBookmarks() {
        // Given
        Bookmark duplicateBookmark = new Bookmark();
        duplicateBookmark.setId(2L);
        duplicateBookmark.setTitle("Duplicate Bookmark");
        duplicateBookmark.setUrl("https://example.com"); // Same URL
        duplicateBookmark.setUser(testUser);
        duplicateBookmark.setCreatedAt(LocalDateTime.now());
        duplicateBookmark.setUpdatedAt(LocalDateTime.now());
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark, duplicateBookmark));

        // When
        List<BookmarkResponse> result = bookmarkService.getDuplicateBookmarks("testuser");

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }

    @Test
    void getBookmarksWithoutTags_ShouldReturnBookmarksWithoutTags() {
        // Given
        Bookmark bookmarkWithoutTags = new Bookmark();
        bookmarkWithoutTags.setId(2L);
        bookmarkWithoutTags.setTitle("Bookmark Without Tags");
        bookmarkWithoutTags.setUrl("https://example2.com");
        bookmarkWithoutTags.setUser(testUser);
        bookmarkWithoutTags.setTags(null);
        bookmarkWithoutTags.setCreatedAt(LocalDateTime.now());
        bookmarkWithoutTags.setUpdatedAt(LocalDateTime.now());
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark, bookmarkWithoutTags));

        // When
        List<BookmarkResponse> result = bookmarkService.getBookmarksWithoutTags("testuser");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Bookmark Without Tags", result.get(0).getTitle());
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }

    @Test
    void getMostClickedBookmarks_ShouldReturnMostClickedBookmarks() {
        // Given
        testBookmark.setClickCount(10);
        
        Bookmark lessClickedBookmark = new Bookmark();
        lessClickedBookmark.setId(2L);
        lessClickedBookmark.setTitle("Less Clicked Bookmark");
        lessClickedBookmark.setUrl("https://example2.com");
        lessClickedBookmark.setUser(testUser);
        lessClickedBookmark.setClickCount(5);
        lessClickedBookmark.setCreatedAt(LocalDateTime.now());
        lessClickedBookmark.setUpdatedAt(LocalDateTime.now());
        
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark, lessClickedBookmark));

        // When
        List<BookmarkResponse> result = bookmarkService.getMostClickedBookmarks("testuser", 5);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Bookmark", result.get(0).getTitle()); // Most clicked should be first
        
        verify(authService).findByUsername("testuser");
        verify(bookmarkRepository).findByUser(testUser);
    }
}
