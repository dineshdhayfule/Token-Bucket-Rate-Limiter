package com.dinesh.ratelimiter.metrics;

import com.dinesh.ratelimiter.repository.BucketRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class RateLimiterMetrics {

    private final Counter allowedRequests;
    private final Counter blockedRequests;
    private final Counter redisHits;
    private final Timer requestLatency;

    public RateLimiterMetrics(MeterRegistry meterRegistry,
            BucketRepository bucketRepository) {

        this.allowedRequests = Counter.builder("ratelimiter.requests.allowed")
                .description("Total allowed requests")
                .register(meterRegistry);

        this.blockedRequests = Counter.builder("ratelimiter.requests.blocked")
                .description("Total blocked requests")
                .register(meterRegistry);

        this.redisHits = Counter.builder("ratelimiter.redis.hits")
                .description("Total Redis bucket lookups")
                .register(meterRegistry);

        this.requestLatency = Timer.builder("ratelimiter.request.latency")
                .description("Rate limiter request latency")
                .register(meterRegistry);

        Gauge.builder("ratelimiter.buckets.current",
                bucketRepository,
                BucketRepository::getBucketCount)
                .description("Current number of active buckets")
                .register(meterRegistry);
    }

    public void incrementAllowedRequests() {
        allowedRequests.increment();
    }

    public void incrementBlockedRequests() {
        blockedRequests.increment();
    }

    public void incrementRedisHits() {
        redisHits.increment();
    }

    public Timer getRequestLatency() {
        return requestLatency;
    }
}