package com.dinesh.ratelimiter.algorithm;

import java.util.concurrent.locks.ReentrantLock;

import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.Bucket;
import org.springframework.stereotype.Component;

@Component
public class TokenBucketRateLimiter {

    private final ReentrantLock lock = new ReentrantLock();

    public RateLimitResult allowRequest(Bucket bucket) {

        lock.lock();

        try {

            refill(bucket);

            if (bucket.getAvailableTokens() > 0) {

                bucket.setAvailableTokens(bucket.getAvailableTokens() - 1);

                return new RateLimitResult(
                        true,
                        bucket.getAvailableTokens());
            }

            return new RateLimitResult(
                    false,
                    bucket.getAvailableTokens());

        } finally {

            lock.unlock();

        }
    }
    private void refill(Bucket bucket) {

        long currentTime = System.currentTimeMillis();

        long timeElapsed = currentTime - bucket.getLastRefillTimestamp();

        long tokensToAdd = (timeElapsed * bucket.getRefillTokensPerSecond()) / 1000;

        if (tokensToAdd > 0) {

            long newTokenCount = Math.min(
                    bucket.getAvailableTokens() + tokensToAdd,
                    bucket.getCapacity());

            bucket.setAvailableTokens(newTokenCount);

            bucket.setLastRefillTimestamp(currentTime);
        }
    }

}