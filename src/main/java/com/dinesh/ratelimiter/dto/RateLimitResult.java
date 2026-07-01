package com.dinesh.ratelimiter.dto;

public class RateLimitResult {

    private final boolean allowed;
    private final long tokensRemaining;

    public RateLimitResult(boolean allowed, long tokensRemaining) {
        this.allowed = allowed;
        this.tokensRemaining = tokensRemaining;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public long getTokensRemaining() {
        return tokensRemaining;
    }
}