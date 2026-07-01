package com.dinesh.ratelimiter.model;


public class Bucket {

    private final long capacity;
    private final long refillTokensPerSecond;

    private long availableTokens;
    private long lastRefillTimestamp;

    public Bucket(long capacity, long refillTokensPerSecond) {
        this.capacity = capacity;
        this.refillTokensPerSecond = refillTokensPerSecond;
        this.availableTokens = capacity;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    public long getCapacity() {
        return capacity;
    }

    public long getRefillTokensPerSecond() {
        return refillTokensPerSecond;
    }

    public long getAvailableTokens() {
        return availableTokens;
    }

    public void setAvailableTokens(long availableTokens) {
        this.availableTokens = availableTokens;
    }

    public long getLastRefillTimestamp() {
        return lastRefillTimestamp;
    }

    public void setLastRefillTimestamp(long lastRefillTimestamp) {
        this.lastRefillTimestamp = lastRefillTimestamp;
    }
}