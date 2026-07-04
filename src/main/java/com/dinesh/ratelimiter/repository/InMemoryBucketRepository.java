package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("!redis")
public class InMemoryBucketRepository implements BucketRepository {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    private String getKey(ClientIdentifier client) {
        return client.getKey();
    }

    @Override
    public Bucket getBucket(ClientIdentifier client) {
        return buckets.get(getKey(client));
    }

    @Override
    public void saveBucket(ClientIdentifier client, Bucket bucket) {
        buckets.put(getKey(client), bucket);
    }

    @Override
    public boolean containsBucket(ClientIdentifier client) {
        return buckets.containsKey(getKey(client));
    }

    @Override
    public void removeBucket(ClientIdentifier client) {
        buckets.remove(getKey(client));
    }

    @Override
    public Bucket getOrCreateBucket(
            ClientIdentifier client,
            long capacity,
            long refillRate
    ) {

        return buckets.computeIfAbsent(
                getKey(client),
                key -> new Bucket(capacity, refillRate)
        );
    }
}