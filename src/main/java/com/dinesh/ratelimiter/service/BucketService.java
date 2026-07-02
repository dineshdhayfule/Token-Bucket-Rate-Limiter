package com.dinesh.ratelimiter.service;
import com.dinesh.ratelimiter.algorithm.TokenBucketRateLimiter;
import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.repository.BucketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service

public class BucketService {

    private final BucketRepository bucketRepository;
    private final TokenBucketRateLimiter rateLimiter;

    @Value("${rate-limiter.capacity}")
    private long capacity;

    @Value("${rate-limiter.refill-rate}")
    private long refillRate;

    public BucketService(BucketRepository bucketRepository,
                         TokenBucketRateLimiter rateLimiter) {

        this.bucketRepository = bucketRepository;
        this.rateLimiter = rateLimiter;
    }

    public RateLimitResult allowRequest(String userId) {

        Bucket bucket = bucketRepository.getOrCreateBucket(
                userId,
                capacity,
                refillRate);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        bucketRepository.saveBucket(userId, bucket);

        return result;
    }
}