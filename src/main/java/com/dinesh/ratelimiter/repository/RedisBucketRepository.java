package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
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

    @Override
    public Bucket getBucket(String userId) {
        return redisTemplate.opsForValue().get(PREFIX + userId);
    }

    @Override
    public void saveBucket(String userId, Bucket bucket) {
        redisTemplate.opsForValue().set(PREFIX + userId, bucket);
    }

    @Override
    public boolean containsBucket(String userId) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(PREFIX + userId)
        );
    }

    @Override
    public void removeBucket(String userId) {
        redisTemplate.delete(PREFIX + userId);
    }

    @Override
    public Bucket getOrCreateBucket(String userId,
                                    long capacity,
                                    long refillRate) {

        String key = PREFIX + userId;

        Bucket bucket = redisTemplate.opsForValue().get(key);

        if (bucket == null) {
            bucket = new Bucket(capacity, refillRate);
            redisTemplate.opsForValue().set(key, bucket);
        }

        return bucket;
    }
}