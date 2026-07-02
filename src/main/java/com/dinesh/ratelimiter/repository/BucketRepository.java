package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;

public interface BucketRepository {

    Bucket getBucket(String userId);

    void saveBucket(String userId, Bucket bucket);

    boolean containsBucket(String userId);

    void removeBucket(String userId);

    Bucket getOrCreateBucket(String userId,
                             long capacity,
                             long refillRate);
}