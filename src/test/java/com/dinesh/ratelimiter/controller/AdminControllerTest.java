package com.dinesh.ratelimiter.controller;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import com.dinesh.ratelimiter.service.AdminService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Test
    @DisplayName("Should return all users")
    void shouldReturnAllUsers() throws Exception {

        List<ClientIdentifier> users = List.of(
                new ClientIdentifier(ClientType.API_KEY, "dinesh"),
                new ClientIdentifier(ClientType.USER, "john"));

        when(adminService.getAllClients()).thenReturn(users);

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("Should return all buckets")
    void shouldReturnAllBuckets() throws Exception {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "dinesh");

        Bucket bucket = new Bucket(10, 2);

        Map<ClientIdentifier, Bucket> buckets = Map.of(client, bucket);

        when(adminService.getAllBuckets()).thenReturn(buckets);

        mockMvc.perform(get("/admin/buckets"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return bucket")
    void shouldReturnBucket() throws Exception {

        Bucket bucket = new Bucket(10, 2);

        when(adminService.getBucket(any(ClientIdentifier.class)))
                .thenReturn(bucket);

        mockMvc.perform(get("/admin/bucket")
                .param("type", "API_KEY")
                .param("id", "dinesh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacity").value(10))
                .andExpect(jsonPath("$.availableTokens").value(10));
    }

    @Test
    @DisplayName("Should delete bucket")
    void shouldDeleteBucket() throws Exception {

        doNothing().when(adminService)
                .deleteBucket(any(ClientIdentifier.class));

        mockMvc.perform(delete("/admin/bucket")
                .param("type", "USER")
                .param("id", "john"))
                .andExpect(status().isOk())
                .andExpect(content().string("Bucket deleted successfully."));
    }

    @Test
    @DisplayName("Should reset all buckets")
    void shouldResetBuckets() throws Exception {

        doNothing().when(adminService).resetAllBuckets();

        mockMvc.perform(post("/admin/reset"))
                .andExpect(status().isOk())
                .andExpect(content().string("All buckets reset successfully."));
    }

    @Test
    @DisplayName("Should return bad request for invalid client type")
    void shouldReturnBadRequestForInvalidClientType() throws Exception {

        mockMvc.perform(get("/admin/bucket")
                .param("type", "INVALID")
                .param("id", "dinesh"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return bad request when id is missing")
    void shouldReturnBadRequestWhenIdMissing() throws Exception {

        mockMvc.perform(get("/admin/bucket")
                .param("type", "API_KEY"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return bad request when type is missing")
    void shouldReturnBadRequestWhenTypeMissing() throws Exception {

        mockMvc.perform(get("/admin/bucket")
                .param("id", "dinesh"))
                .andExpect(status().isBadRequest());
    }
}