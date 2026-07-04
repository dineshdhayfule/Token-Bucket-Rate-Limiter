package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Profile("redis")
public class RedisBucketRepository implements BucketRepository {

    private static final String PREFIX = "bucket:";

    private final RedisTemplate<String, Bucket> redisTemplate;

    public RedisBucketRepository(RedisTemplate<String, Bucket> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String getKey(ClientIdentifier client) {
        return PREFIX + client.getKey();
    }

    @Override
    public Bucket getBucket(ClientIdentifier client) {
        return redisTemplate.opsForValue().get(getKey(client));
    }

    @Override
    public void saveBucket(ClientIdentifier client, Bucket bucket) {
        redisTemplate.opsForValue().set(getKey(client), bucket);
    }

    @Override
    public boolean containsBucket(ClientIdentifier client) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(getKey(client))
        );
    }

    @Override
    public void removeBucket(ClientIdentifier client) {
        redisTemplate.delete(getKey(client));
    }

    @Override
    public Bucket getOrCreateBucket(
            ClientIdentifier client,
            long capacity,
            long refillRate
    ) {

        String key = getKey(client);

        Bucket bucket = redisTemplate.opsForValue().get(key);

        if (bucket == null) {
            bucket = new Bucket(capacity, refillRate);
            redisTemplate.opsForValue().set(key, bucket);
        }

        return bucket;
    }
}