package com.dinesh.ratelimiter.controller;

import com.dinesh.ratelimiter.dto.RateLimitResult;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import com.dinesh.ratelimiter.service.BucketService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BucketController.class)
class BucketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BucketService bucketService;

    @Test
    void shouldAllowRequest() throws Exception {

        when(bucketService.allowRequest(ArgumentMatchers.any(ClientIdentifier.class)))
                .thenReturn(new RateLimitResult(true, 9));

        mockMvc.perform(get("/api/check")
                .param("type", "API_KEY")
                .param("id", "dinesh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowed").value(true))
                .andExpect(jsonPath("$.tokensRemaining").value(9));
    }

    @Test
    void shouldBlockRequest() throws Exception {

        when(bucketService.allowRequest(ArgumentMatchers.any(ClientIdentifier.class)))
                .thenReturn(new RateLimitResult(false, 0));

        mockMvc.perform(get("/api/check")
                .param("type", "USER")
                .param("id", "john"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.allowed").value(false))
                .andExpect(jsonPath("$.tokensRemaining").value(0));
    }

    @Test
    void shouldReturnBadRequestForInvalidClientType() throws Exception {

        mockMvc.perform(get("/api/check")
                .param("type", "INVALID")
                .param("id", "dinesh"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenIdIsMissing() throws Exception {

        mockMvc.perform(get("/api/check")
                .param("type", "API_KEY"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenTypeIsMissing() throws Exception {

        mockMvc.perform(get("/api/check")
                .param("id", "dinesh"))
                .andExpect(status().isBadRequest());
    }

}