package com.dinesh.ratelimiter.repository;

import java.util.concurrent.ConcurrentHashMap;

import com.dinesh.ratelimiter.model.Bucket;
import org.springframework.stereotype.Repository;

@Repository
public class BucketRepository {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket getBucket(String userId) {
        return buckets.get(userId);
    }

    public void saveBucket(String userId, Bucket bucket) {
        buckets.put(userId, bucket);
    }

    public boolean containsBucket(String userId) {
        return buckets.containsKey(userId);
    }

    public void removeBucket(String userId) {
        buckets.remove(userId);
    }

    public Bucket getOrCreateBucket(String userId,
                                    long capacity,
                                    long refillRate) {

        return buckets.computeIfAbsent(
                userId,
                id -> new Bucket(capacity, refillRate));
    }
}