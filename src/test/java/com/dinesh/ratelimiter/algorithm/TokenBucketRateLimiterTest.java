package com.dinesh.ratelimiter.algorithm;

import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.Bucket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenBucketRateLimiterTest {

    private TokenBucketRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new TokenBucketRateLimiter();
    }

    @Test
    void shouldAllowRequestWhenTokensAreAvailable() {

        Bucket bucket = new Bucket(5, 1);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertTrue(result.isAllowed());
        assertEquals(4, result.getTokensRemaining());
    }

    @Test
    void shouldRejectRequestWhenBucketIsEmpty() {

        Bucket bucket = new Bucket(1, 1);

        rateLimiter.allowRequest(bucket);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertFalse(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());
    }

    @Test
    void shouldConsumeMultipleTokens() {

        Bucket bucket = new Bucket(3, 1);

        assertTrue(rateLimiter.allowRequest(bucket).isAllowed());
        assertTrue(rateLimiter.allowRequest(bucket).isAllowed());
        assertTrue(rateLimiter.allowRequest(bucket).isAllowed());

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertFalse(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());
    }

    @Test
    void shouldRefillTokensAfterTimeElapsed() throws InterruptedException {

        Bucket bucket = new Bucket(2, 1);

        rateLimiter.allowRequest(bucket);
        rateLimiter.allowRequest(bucket);

        assertEquals(0, bucket.getAvailableTokens());

        Thread.sleep(1100);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertTrue(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());
    }

    @Test
    void shouldNeverExceedBucketCapacity() throws InterruptedException {

        Bucket bucket = new Bucket(5, 10);

        Thread.sleep(1500);

        rateLimiter.allowRequest(bucket);

        assertTrue(bucket.getAvailableTokens() <= bucket.getCapacity());
    }

    @Test
    void shouldDecreaseTokenCountAfterEverySuccessfulRequest() {

        Bucket bucket = new Bucket(4, 1);

        rateLimiter.allowRequest(bucket);
        assertEquals(3, bucket.getAvailableTokens());

        rateLimiter.allowRequest(bucket);
        assertEquals(2, bucket.getAvailableTokens());

        rateLimiter.allowRequest(bucket);
        assertEquals(1, bucket.getAvailableTokens());
    }

    @Test
    void shouldHandleZeroCapacityBucket() {

        Bucket bucket = new Bucket(0, 1);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertFalse(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());
    }

    @Test
    void shouldNotRefillBeforeOneSecond() throws InterruptedException {

        Bucket bucket = new Bucket(1, 1);

        rateLimiter.allowRequest(bucket);

        Thread.sleep(500);

        RateLimitResult result = rateLimiter.allowRequest(bucket);

        assertFalse(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());
    }

}