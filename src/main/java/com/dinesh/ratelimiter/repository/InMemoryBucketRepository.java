package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("memory")
public class InMemoryBucketRepository implements BucketRepository {

    private final ConcurrentHashMap<String, Bucket> buckets =
            new ConcurrentHashMap<>();

    @Override
    public Bucket getBucket(String userId) {
        return buckets.get(userId);
    }

    @Override
    public void saveBucket(String userId, Bucket bucket) {
        buckets.put(userId, bucket);
    }

    @Override
    public boolean containsBucket(String userId) {
        return buckets.containsKey(userId);
    }

    @Override
    public void removeBucket(String userId) {
        buckets.remove(userId);
    }

    @Override
    public Bucket getOrCreateBucket(String userId,
                                    long capacity,
                                    long refillRate) {

        return buckets.computeIfAbsent(
                userId,
                id -> new Bucket(capacity, refillRate));
    }
}