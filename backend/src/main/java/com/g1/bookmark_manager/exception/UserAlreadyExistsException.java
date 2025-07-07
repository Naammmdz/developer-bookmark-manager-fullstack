package com.g1.bookmark_manager.exception;

public class UserAlreadyExistsException extends RuntimeException {
    private String field;

    public UserAlreadyExistsException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}

