package com.g1.bookmark_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatisticsSummaryDTO {
    private long totalBookmarks;
    private long totalCollections;
    private long totalUsers;
}
