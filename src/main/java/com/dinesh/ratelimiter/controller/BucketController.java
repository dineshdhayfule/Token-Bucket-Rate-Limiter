package com.dinesh.ratelimiter.controller;

import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import com.dinesh.ratelimiter.service.BucketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BucketController {

    private final BucketService bucketService;

    public BucketController(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    @GetMapping("/api/check")
    public RateLimitResult checkRateLimit(
            @RequestParam ClientType type,
            @RequestParam String id
    ) {

        ClientIdentifier client = new ClientIdentifier(type, id);

        return bucketService.allowRequest(client);
    }
}