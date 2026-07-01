package com.dinesh.ratelimiter.dto;

public class CheckResponse {

    private boolean allowed;
    private long tokensRemaining;

    public CheckResponse(boolean allowed, long tokensRemaining) {
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