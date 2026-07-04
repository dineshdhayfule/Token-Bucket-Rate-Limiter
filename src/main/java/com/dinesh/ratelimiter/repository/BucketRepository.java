package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;

public interface BucketRepository {

    Bucket getBucket(ClientIdentifier client);

    void saveBucket(ClientIdentifier client, Bucket bucket);

    boolean containsBucket(ClientIdentifier client);

    void removeBucket(ClientIdentifier client);

    Bucket getOrCreateBucket(
            ClientIdentifier client,
            long capacity,
            long refillRate
    );
}