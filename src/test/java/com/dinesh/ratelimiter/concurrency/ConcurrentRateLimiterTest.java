package com.dinesh.ratelimiter.concurrency;

import com.dinesh.ratelimiter.algorithm.TokenBucketRateLimiter;
import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.Bucket;
import org.junit.jupiter.api.Test;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class ConcurrentRateLimiterTest {

    @Test
    void shouldAllowOnlyBucketCapacityRequests() throws Exception {

        TokenBucketRateLimiter rateLimiter = new TokenBucketRateLimiter();

        Bucket bucket = new Bucket(100, 0);

        int totalRequests = 1000;

        ExecutorService executor = Executors.newFixedThreadPool(100);

        CountDownLatch startLatch = new CountDownLatch(1);

        CountDownLatch finishLatch = new CountDownLatch(totalRequests);

        AtomicInteger allowed = new AtomicInteger();

        AtomicInteger blocked = new AtomicInteger();

        for (int i = 0; i < totalRequests; i++) {

            executor.submit(() -> {

                try {

                    startLatch.await();

                    RateLimitResult result = rateLimiter.allowRequest(bucket);

                    if (result.isAllowed()) {
                        allowed.incrementAndGet();
                    } else {
                        blocked.incrementAndGet();
                    }

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    finishLatch.countDown();
                }

            });

        }

        startLatch.countDown();

        finishLatch.await();

        executor.shutdown();

        assertEquals(100, allowed.get());

        assertEquals(900, blocked.get());

        assertEquals(0, bucket.getAvailableTokens());
    }

    @Test
    void shouldNeverProduceNegativeTokens() throws Exception {

        TokenBucketRateLimiter rateLimiter = new TokenBucketRateLimiter();

        Bucket bucket = new Bucket(50, 0);

        ExecutorService executor = Executors.newFixedThreadPool(50);

        CountDownLatch latch = new CountDownLatch(500);

        for (int i = 0; i < 500; i++) {

            executor.submit(() -> {

                rateLimiter.allowRequest(bucket);

                latch.countDown();

            });

        }

        latch.await();

        executor.shutdown();

        assertTrue(bucket.getAvailableTokens() >= 0);

    }

}