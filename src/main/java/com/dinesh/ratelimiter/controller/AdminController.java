package com.dinesh.ratelimiter.controller;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import com.dinesh.ratelimiter.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<ClientIdentifier> getAllUsers() {
        return adminService.getAllClients();
    }

    @GetMapping("/buckets")
    public Map<ClientIdentifier, Bucket> getAllBuckets() {
        return adminService.getAllBuckets();
    }

    @GetMapping("/bucket")
    public Bucket getBucket(
            @RequestParam ClientType type,
            @RequestParam String id) {

        ClientIdentifier client = new ClientIdentifier(type, id);

        return adminService.getBucket(client);
    }

    @DeleteMapping("/bucket")
    public String deleteBucket(
            @RequestParam ClientType type,
            @RequestParam String id) {

        ClientIdentifier client = new ClientIdentifier(type, id);

        adminService.deleteBucket(client);

        return "Bucket deleted successfully.";
    }

    @PostMapping("/reset")
    public String resetBuckets() {

        adminService.resetAllBuckets();

        return "All buckets reset successfully.";
    }
}