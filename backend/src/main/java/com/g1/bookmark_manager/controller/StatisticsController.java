package com.g1.bookmark_manager.controller;

import com.g1.bookmark_manager.dto.response.StatisticsSummaryDTO;
import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.repository.CollectionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "Statistics", description = "Endpoints for user and collection statistics")
public class StatisticsController {

    @Autowired private CollectionRepository collectionRepo;
    @Autowired private BookmarkRepository bookmarkRepo;

    @GetMapping("/summary")
    @Operation(summary = "Get full summary of collection & bookmark statistics")
    public Map<String, Object> getAllStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("collections", getUserStats(authentication));
        result.put("bookmarks", getUserBookmarkStats(authentication));
        result.put("topCollections", getTopCollections(authentication));
        result.put("tags", getBookmarkTagStats(authentication));
        return result;
    }

    @GetMapping("/top-collection")
    @Operation(summary = "Get top collection by bookmark count")
    public String getTopCollection(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<String> top = collectionRepo.findTopCollectionNameByBookmarkCount(user);
        return top.isEmpty() ? "Không có collection nào" : top.get(0);
    }

    @GetMapping("/top-collections")
    @Operation(summary = "Get top 5 collections by bookmark count")
    public List<String> getTopCollections(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return collectionRepo.findTopCollectionNameByBookmarkCount(user);
    }

    @GetMapping("/user")
    public Map<String, Long> getUserStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        long total = collectionRepo.countByUser(user);
        long publicCount = collectionRepo.countByUserAndIsPublic(user, true);
        long privateCount = total - publicCount;

        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", total);
        stats.put("public", publicCount);
        stats.put("private", privateCount);

        return stats;
    }

    @GetMapping("/user/bookmarks")
    public Map<String, Long> getUserBookmarkStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        long total = bookmarkRepo.countByUser(user);
        long favorites = bookmarkRepo.countByUserAndIsFavoriteTrue(user);
        long publicCount = bookmarkRepo.countByUserAndIsPublicTrue(user);

        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", total);
        stats.put("favorites", favorites);
        stats.put("public", publicCount);

        return stats;
    }

    @GetMapping("/user/tags")
    @Operation(summary = "Get tag usage statistics")
    public Map<String, Long> getBookmarkTagStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return bookmarkRepo.findByUser(user).stream()
                .flatMap(b -> b.getTags().stream())
                .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
    }

    @GetMapping("/summary/date-range")
    public StatisticsSummaryDTO getSummaryByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        LocalDate start = startDate != null ? startDate : LocalDate.of(2000, 1, 1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        long totalBookmarks = bookmarkRepo.countByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        long totalCollections = collectionRepo.countByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        long totalUsers = 0; // optional nếu bạn có UserRepository thì đếm số user mới trong khoảng này

        return new StatisticsSummaryDTO(totalBookmarks, totalCollections, totalUsers);
    }

}
