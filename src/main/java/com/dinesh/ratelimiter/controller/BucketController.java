package com.dinesh.ratelimiter.controller;

import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.service.BucketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BucketController {

    private final BucketService bucketService;

    public BucketController(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    @GetMapping("/check")
    public RateLimitResult checkRateLimit(
            @RequestParam String userId) {

        return bucketService.allowRequest(userId);
    }
}