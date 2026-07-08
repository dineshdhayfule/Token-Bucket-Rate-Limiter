package com.dinesh.ratelimiter.service;

import com.dinesh.ratelimiter.algorithm.TokenBucketRateLimiter;
import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.metrics.RateLimiterMetrics;
import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.repository.BucketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BucketService {

    private final BucketRepository bucketRepository;
    private final TokenBucketRateLimiter rateLimiter;
    private final RateLimiterMetrics metrics;

    @Value("${rate-limiter.capacity}")
    private long capacity;

    @Value("${rate-limiter.refill-rate}")
    private long refillRate;

    public BucketService(
            BucketRepository bucketRepository,
            TokenBucketRateLimiter rateLimiter,
            RateLimiterMetrics metrics) {

        this.bucketRepository = bucketRepository;
        this.rateLimiter = rateLimiter;
        this.metrics = metrics;
    }

    public RateLimitResult allowRequest(ClientIdentifier client) {

        return metrics.getRequestLatency().record(() -> {

            metrics.incrementRedisHits();

            Bucket bucket = bucketRepository.getOrCreateBucket(
                    client,
                    capacity,
                    refillRate);

            RateLimitResult result = rateLimiter.allowRequest(bucket);

            bucketRepository.saveBucket(client, bucket);

            if (result.isAllowed()) {
                metrics.incrementAllowedRequests();
            } else {
                metrics.incrementBlockedRequests();
            }

            return result;
        });
    }
}