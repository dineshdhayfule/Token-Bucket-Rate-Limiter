package com.dinesh.ratelimiter.repository;

import java.util.List;
import java.util.Map;

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
            long refillRate);

    List<ClientIdentifier> getAllClients();

    Map<ClientIdentifier, Bucket> getAllBuckets();

    void removeAllBuckets();

    long getBucketCount();
}