package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class InMemoryBucketRepositoryTest {

    private InMemoryBucketRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryBucketRepository();
    }

    @Test
    void shouldSaveBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "dinesh");

        Bucket bucket = new Bucket(10, 2);

        repository.saveBucket(client, bucket);

        assertNotNull(repository.getBucket(client));
        assertEquals(bucket, repository.getBucket(client));
    }

    @Test
    void shouldReturnNullWhenBucketDoesNotExist() {

        ClientIdentifier client = new ClientIdentifier(ClientType.USER, "john");

        assertNull(repository.getBucket(client));
    }

    @Test
    void shouldCreateBucketIfNotExists() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "dinesh");

        Bucket bucket = repository.getOrCreateBucket(client, 20, 5);

        assertNotNull(bucket);
        assertEquals(20, bucket.getCapacity());
        assertEquals(5, bucket.getRefillTokensPerSecond());
    }

    @Test
    void shouldReturnExistingBucketInsteadOfCreatingNewOne() {

        ClientIdentifier client = new ClientIdentifier(ClientType.USER, "mobile-app");

        Bucket first = repository.getOrCreateBucket(client, 10, 2);

        Bucket second = repository.getOrCreateBucket(client, 100, 20);

        assertSame(first, second);
    }

    @Test
    void shouldContainBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.IP, "127.0.0.1");

        repository.saveBucket(client, new Bucket(5, 1));

        assertTrue(repository.containsBucket(client));
    }

    @Test
    void shouldRemoveBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.JWT, "user123");

        repository.saveBucket(client, new Bucket(5, 1));

        repository.removeBucket(client);

        assertFalse(repository.containsBucket(client));
    }

    @Test
    void shouldReturnAllClients() {

        repository.saveBucket(
                new ClientIdentifier(ClientType.API_KEY, "one"),
                new Bucket(5, 1));

        repository.saveBucket(
                new ClientIdentifier(ClientType.USER, "two"),
                new Bucket(5, 1));

        List<ClientIdentifier> clients = repository.getAllClients();

        assertEquals(2, clients.size());
    }

    @Test
    void shouldReturnAllBuckets() {

        repository.saveBucket(
                new ClientIdentifier(ClientType.API_KEY, "one"),
                new Bucket(5, 1));

        repository.saveBucket(
                new ClientIdentifier(ClientType.USER, "two"),
                new Bucket(10, 2));

        Map<ClientIdentifier, Bucket> buckets = repository.getAllBuckets();

        assertEquals(2, buckets.size());
    }

    @Test
    void shouldRemoveAllBuckets() {

        repository.saveBucket(
                new ClientIdentifier(ClientType.API_KEY, "one"),
                new Bucket(5, 1));

        repository.saveBucket(
                new ClientIdentifier(ClientType.USER, "two"),
                new Bucket(10, 2));

        repository.removeAllBuckets();

        assertEquals(0, repository.getBucketCount());
        assertTrue(repository.getAllBuckets().isEmpty());
    }

    @Test
    void shouldReturnCorrectBucketCount() {

        assertEquals(0, repository.getBucketCount());

        repository.saveBucket(
                new ClientIdentifier(ClientType.API_KEY, "one"),
                new Bucket(5, 1));

        repository.saveBucket(
                new ClientIdentifier(ClientType.USER, "two"),
                new Bucket(5, 1));

        assertEquals(2, repository.getBucketCount());
    }
}