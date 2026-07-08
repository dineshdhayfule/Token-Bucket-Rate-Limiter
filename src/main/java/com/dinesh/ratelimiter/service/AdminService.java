package com.dinesh.ratelimiter.service;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.repository.BucketRepository;
import org.springframework.stereotype.Service;
import com.dinesh.ratelimiter.exception.BucketNotFoundException;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final BucketRepository bucketRepository;

    public AdminService(BucketRepository bucketRepository) {
        this.bucketRepository = bucketRepository;
    }

    public List<ClientIdentifier> getAllClients() {
        return bucketRepository.getAllClients();
    }

    public Map<ClientIdentifier, Bucket> getAllBuckets() {
        return bucketRepository.getAllBuckets();
    }

    public Bucket getBucket(ClientIdentifier client) {

        Bucket bucket = bucketRepository.getBucket(client);

        if (bucket == null) {
            throw new BucketNotFoundException(
                    "Bucket not found for client: " + client.getKey());
        }

        return bucket;
    }

    public void deleteBucket(ClientIdentifier client) {

        if (!bucketRepository.containsBucket(client)) {
            throw new BucketNotFoundException(
                    "Bucket not found for client: " + client.getKey());
        }

        bucketRepository.removeBucket(client);
    }

    public void resetAllBuckets() {
        bucketRepository.removeAllBuckets();
    }
}