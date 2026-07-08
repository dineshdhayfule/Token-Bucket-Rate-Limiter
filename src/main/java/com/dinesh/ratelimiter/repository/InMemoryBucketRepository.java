package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@Profile("!redis")
public class InMemoryBucketRepository implements BucketRepository {

    private final ConcurrentHashMap<ClientIdentifier, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public Bucket getBucket(ClientIdentifier client) {
        return buckets.get(client);
    }

    @Override
    public void saveBucket(ClientIdentifier client, Bucket bucket) {
        buckets.put(client, bucket);
    }

    @Override
    public boolean containsBucket(ClientIdentifier client) {
        return buckets.containsKey(client);
    }

    @Override
    public void removeBucket(ClientIdentifier client) {
        buckets.remove(client);
    }

    @Override
    public Bucket getOrCreateBucket(
            ClientIdentifier client,
            long capacity,
            long refillRate) {

        return buckets.computeIfAbsent(
                client,
                key -> new Bucket(capacity, refillRate));
    }

    @Override
    public List<ClientIdentifier> getAllClients() {
        return new ArrayList<>(buckets.keySet());
    }

    @Override
    public Map<ClientIdentifier, Bucket> getAllBuckets() {
        return new HashMap<>(buckets);
    }

    @Override
    public void removeAllBuckets() {
        buckets.clear();
    }

    @Override
    public long getBucketCount() {
        return buckets.size();
    }
}