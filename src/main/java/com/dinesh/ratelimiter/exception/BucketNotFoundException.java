package com.dinesh.ratelimiter.exception;

public class BucketNotFoundException extends RuntimeException {

    public BucketNotFoundException(String message) {
        super(message);
    }
}