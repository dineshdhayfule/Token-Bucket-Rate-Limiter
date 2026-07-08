package com.dinesh.ratelimiter.service;

import com.dinesh.ratelimiter.algorithm.TokenBucketRateLimiter;
import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.metrics.RateLimiterMetrics;
import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import com.dinesh.ratelimiter.repository.BucketRepository;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class BucketServiceTest {

    private BucketRepository bucketRepository;
    private TokenBucketRateLimiter rateLimiter;
    private RateLimiterMetrics metrics;

    private BucketService bucketService;

    @BeforeEach
    void setUp() {

        bucketRepository = mock(BucketRepository.class);
        rateLimiter = mock(TokenBucketRateLimiter.class);

        metrics = new RateLimiterMetrics(
                new SimpleMeterRegistry(),
                bucketRepository);

        bucketService = new BucketService(
                bucketRepository,
                rateLimiter,
                metrics);

        ReflectionTestUtils.setField(bucketService, "capacity", 10L);
        ReflectionTestUtils.setField(bucketService, "refillRate", 2L);
    }

    @Test
    void shouldAllowRequest() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "dinesh");

        Bucket bucket = new Bucket(10, 2);

        when(bucketRepository.getOrCreateBucket(client, 10L, 2L))
                .thenReturn(bucket);

        when(rateLimiter.allowRequest(bucket))
                .thenReturn(new RateLimitResult(true, 9));

        RateLimitResult result = bucketService.allowRequest(client);

        assertTrue(result.isAllowed());
        assertEquals(9, result.getTokensRemaining());

        verify(bucketRepository).getOrCreateBucket(client, 10L, 2L);
        verify(bucketRepository).saveBucket(client, bucket);
        verify(rateLimiter).allowRequest(bucket);
    }

    @Test
    void shouldBlockRequest() {

        ClientIdentifier client = new ClientIdentifier(ClientType.JWT, "user123");

        Bucket bucket = new Bucket(1, 1);

        when(bucketRepository.getOrCreateBucket(client, 10L, 2L))
                .thenReturn(bucket);

        when(rateLimiter.allowRequest(bucket))
                .thenReturn(new RateLimitResult(false, 0));

        RateLimitResult result = bucketService.allowRequest(client);

        assertFalse(result.isAllowed());
        assertEquals(0, result.getTokensRemaining());

        verify(bucketRepository).saveBucket(client, bucket);
    }

    @Test
    void shouldSaveBucketAfterProcessing() {

        ClientIdentifier client = new ClientIdentifier(ClientType.IP, "127.0.0.1");

        Bucket bucket = new Bucket(5, 1);

        when(bucketRepository.getOrCreateBucket(any(), anyLong(), anyLong()))
                .thenReturn(bucket);

        when(rateLimiter.allowRequest(bucket))
                .thenReturn(new RateLimitResult(true, 4));

        bucketService.allowRequest(client);

        ArgumentCaptor<Bucket> captor = ArgumentCaptor.forClass(Bucket.class);

        verify(bucketRepository)
                .saveBucket(eq(client), captor.capture());

        assertEquals(bucket, captor.getValue());
    }

    @Test
    void shouldInvokeRateLimiterExactlyOnce() {

        ClientIdentifier client = new ClientIdentifier(ClientType.USER, "mobile-app");

        Bucket bucket = new Bucket(10, 1);

        when(bucketRepository.getOrCreateBucket(any(), anyLong(), anyLong()))
                .thenReturn(bucket);

        when(rateLimiter.allowRequest(bucket))
                .thenReturn(new RateLimitResult(true, 9));

        bucketService.allowRequest(client);

        verify(rateLimiter, times(1))
                .allowRequest(bucket);
    }

    @Test
    void shouldCreateBucketWithConfiguredCapacityAndRefillRate() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "abc");

        Bucket bucket = new Bucket(10, 2);

        when(bucketRepository.getOrCreateBucket(client, 10L, 2L))
                .thenReturn(bucket);

        when(rateLimiter.allowRequest(bucket))
                .thenReturn(new RateLimitResult(true, 9));

        bucketService.allowRequest(client);

        verify(bucketRepository)
                .getOrCreateBucket(client, 10L, 2L);
    }

}