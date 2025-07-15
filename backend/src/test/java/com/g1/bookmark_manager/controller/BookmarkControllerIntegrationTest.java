package com.g1.bookmark_manager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.g1.bookmark_manager.dto.request.BookmarkRequest;
import com.g1.bookmark_manager.entity.Bookmark;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.repository.UserRepository;
import com.g1.bookmark_manager.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class BookmarkControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private BookmarkRepository bookmarkRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthService authService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private User testUser;
    private Bookmark testBookmark;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        objectMapper = new ObjectMapper();
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        
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
    }

    @Test
    @WithMockUser(username = "testuser")
    void createBookmark_ShouldReturnCreatedBookmark() throws Exception {
        // Given
        BookmarkRequest request = new BookmarkRequest();
        request.setTitle("Test Bookmark");
        request.setUrl("https://example.com");
        request.setDescription("Test description");
        request.setTags("tag1,tag2");
        request.setIsFavorite(false);

        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(testBookmark);

        // When & Then
        mockMvc.perform(post("/api/bookmarks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Bookmark"))
                .andExpect(jsonPath("$.url").value("https://example.com"))
                .andExpect(jsonPath("$.description").value("Test description"))
                .andExpect(jsonPath("$.tags").value("tag1,tag2"))
                .andExpect(jsonPath("$.isFavorite").value(false));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getBookmarkById_ShouldReturnBookmark() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));

        // When & Then
        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Bookmark"))
                .andExpect(jsonPath("$.url").value("https://example.com"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateBookmark_ShouldReturnUpdatedBookmark() throws Exception {
        // Given
        BookmarkRequest request = new BookmarkRequest();
        request.setTitle("Updated Bookmark");
        request.setUrl("https://updated.com");
        request.setDescription("Updated description");
        request.setTags("updated-tag");
        request.setIsFavorite(true);

        Bookmark updatedBookmark = new Bookmark();
        updatedBookmark.setId(1L);
        updatedBookmark.setTitle("Updated Bookmark");
        updatedBookmark.setUrl("https://updated.com");
        updatedBookmark.setDescription("Updated description");
        updatedBookmark.setTags(Arrays.asList("updated-tag"));
        updatedBookmark.setIsFavorite(true);
        updatedBookmark.setUser(testUser);
        updatedBookmark.setCreatedAt(LocalDateTime.now());
        updatedBookmark.setUpdatedAt(LocalDateTime.now());

        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(updatedBookmark);

        // When & Then
        mockMvc.perform(put("/api/bookmarks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Bookmark"))
                .andExpect(jsonPath("$.url").value("https://updated.com"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.isFavorite").value(true));
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteBookmark_ShouldReturnNoContent() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));

        // When & Then
        mockMvc.perform(delete("/api/bookmarks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "testuser")
    void toggleFavorite_ShouldReturnUpdatedBookmark() throws Exception {
        // Given
        Bookmark favoriteBookmark = new Bookmark();
        favoriteBookmark.setId(1L);
        favoriteBookmark.setTitle("Test Bookmark");
        favoriteBookmark.setUrl("https://example.com");
        favoriteBookmark.setDescription("Test description");
        favoriteBookmark.setTags(Arrays.asList("tag1", "tag2"));
        favoriteBookmark.setIsFavorite(true);
        favoriteBookmark.setUser(testUser);
        favoriteBookmark.setCreatedAt(LocalDateTime.now());
        favoriteBookmark.setUpdatedAt(LocalDateTime.now());

        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(favoriteBookmark);

        // When & Then
        mockMvc.perform(patch("/api/bookmarks/1/favorite"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isFavorite").value(true));
    }

    @Test
    @WithMockUser(username = "testuser")
    void recordClick_ShouldReturnUpdatedBookmark() throws Exception {
        // Given
        Bookmark clickedBookmark = new Bookmark();
        clickedBookmark.setId(1L);
        clickedBookmark.setTitle("Test Bookmark");
        clickedBookmark.setUrl("https://example.com");
        clickedBookmark.setDescription("Test description");
        clickedBookmark.setTags(Arrays.asList("tag1", "tag2"));
        clickedBookmark.setIsFavorite(false);
        clickedBookmark.setUser(testUser);
        clickedBookmark.setCreatedAt(LocalDateTime.now());
        clickedBookmark.setUpdatedAt(LocalDateTime.now());
        clickedBookmark.setClickCount(1);

        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(1L)).thenReturn(Optional.of(testBookmark));
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(clickedBookmark);

        // When & Then
        mockMvc.perform(post("/api/bookmarks/1/click"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    void searchBookmarks_ShouldReturnMatchingBookmarks() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.searchBookmarks(testUser, "test")).thenReturn(Arrays.asList(testBookmark));

        // When & Then
        mockMvc.perform(get("/api/bookmarks/search")
                .param("q", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Bookmark"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getBookmarksByTag_ShouldReturnBookmarksWithTag() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When & Then
        mockMvc.perform(get("/api/bookmarks/tag/tag1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Bookmark"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getUserTags_ShouldReturnAllTags() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));

        // When & Then
        mockMvc.perform(get("/api/bookmarks/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0]").value("tag1"))
                .andExpect(jsonPath("$[1]").value("tag2"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getBookmarkStats_ShouldReturnStatistics() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findByUser(testUser)).thenReturn(Arrays.asList(testBookmark));
        when(bookmarkRepository.findByUserAndIsFavoriteTrue(testUser)).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/bookmarks/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.favorites").value(0));
    }

    @Test
    void createBookmark_ShouldReturnUnauthorized_WhenNotAuthenticated() throws Exception {
        // Given
        BookmarkRequest request = new BookmarkRequest();
        request.setTitle("Test Bookmark");
        request.setUrl("https://example.com");

        // When & Then
        mockMvc.perform(post("/api/bookmarks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void createBookmark_ShouldReturnBadRequest_WhenInvalidData() throws Exception {
        // Given
        BookmarkRequest request = new BookmarkRequest();
        // Missing required fields

        // When & Then
        mockMvc.perform(post("/api/bookmarks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getBookmarkById_ShouldReturnNotFound_WhenBookmarkNotExists() throws Exception {
        // Given
        when(authService.findByUsername("testuser")).thenReturn(testUser);
        when(bookmarkRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/bookmarks/999"))
                .andExpect(status().isNotFound());
    }
}
