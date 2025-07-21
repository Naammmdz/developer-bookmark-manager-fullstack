package com.g1.bookmark_manager.service;

import com.g1.bookmark_manager.entity.User;
import com.g1.bookmark_manager.repository.BookmarkRepository;
import com.g1.bookmark_manager.repository.CollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final BookmarkRepository bookmarkRepo;
    private final CollectionRepository collectionRepo;

    public long countTotalBookmarks(Long userId) {
        return bookmarkRepo.countByUserId(userId);
    }

    public long countFavoriteBookmarks(Long userId) {
        return bookmarkRepo.countByUserIdAndIsFavoriteTrue(userId);
    }

    public Map<String, Long> countByTag(Long userId) {
        return bookmarkRepo.findAllByUserId(userId).stream()
                .flatMap(b -> b.getTags().stream())
                .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
    }

    public List<String> getTopCollections(Long userId) {
        return collectionRepo.findTopCollectionNameByBookmarkCount(
                new User(userId)  // giả định constructor User(Long id) tồn tại
        );
    }
}

