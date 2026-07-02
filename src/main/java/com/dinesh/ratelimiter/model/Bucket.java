package com.dinesh.ratelimiter.model;

public class Bucket {

    private long capacity;
    private long refillTokensPerSecond;

    private long availableTokens;
    private long lastRefillTimestamp;

    public Bucket() {
    }

    public Bucket(long capacity, long refillTokensPerSecond) {
        this.capacity = capacity;
        this.refillTokensPerSecond = refillTokensPerSecond;
        this.availableTokens = capacity;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    public long getCapacity() {
        return capacity;
    }

    public void setCapacity(long capacity) {
        this.capacity = capacity;
    }

    public long getRefillTokensPerSecond() {
        return refillTokensPerSecond;
    }

    public void setRefillTokensPerSecond(long refillTokensPerSecond) {
        this.refillTokensPerSecond = refillTokensPerSecond;
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