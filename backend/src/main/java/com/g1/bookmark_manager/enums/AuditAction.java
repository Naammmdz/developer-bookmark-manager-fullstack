package com.g1.bookmark_manager.enums;

public enum AuditAction {
    // Bookmark
    CREATE_BOOKMARK, UPDATE_BOOKMARK, PATCH_BOOKMARK, DELETE_BOOKMARK,

    // Collection
    CREATE_COLLECTION, UPDATE_COLLECTION, DELETE_COLLECTION,

    // Hệ thống
    REGISTER, LOGIN, UPDATE_PROFILE, CHANGE_PASSWORD, SEND_EMAIL
}
