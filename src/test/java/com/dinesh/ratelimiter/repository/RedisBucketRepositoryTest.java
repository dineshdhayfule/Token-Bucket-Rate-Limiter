package com.dinesh.ratelimiter.repository;

import com.dinesh.ratelimiter.model.Bucket;
import com.dinesh.ratelimiter.model.ClientIdentifier;
import com.dinesh.ratelimiter.model.ClientType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.redis.DataRedisTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.context.annotation.Import;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Disabled;

@Disabled("Redis Testcontainers test - deferred to Phase 8")
@Testcontainers
@DataRedisTest
@Import({
        RedisBucketRepository.class,
        RedisBucketRepositoryTest.RedisTestConfig.class
})
class RedisBucketRepositoryTest {

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void configureRedis(DynamicPropertyRegistry registry) {

        registry.add(
                "spring.data.redis.host",
                redis::getHost);

        registry.add(
                "spring.data.redis.port",
                redis::getFirstMappedPort);
    }

    @Autowired
    private RedisBucketRepository repository;

    @BeforeEach
    void cleanUp() {
        repository.removeAllBuckets();
    }

    @TestConfiguration
    static class RedisTestConfig {

        @Bean
        LettuceConnectionFactory redisConnectionFactory(
                org.springframework.core.env.Environment environment) {

            RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(
                    environment.getProperty("spring.data.redis.host"),
                    Integer.parseInt(environment.getProperty("spring.data.redis.port")));

            return new LettuceConnectionFactory(configuration);
        }

        @Bean
        RedisTemplate<String, Bucket> redisTemplate(
                LettuceConnectionFactory connectionFactory) {

            RedisTemplate<String, Bucket> template = new RedisTemplate<>();

            template.setConnectionFactory(connectionFactory);
            template.afterPropertiesSet();

            return template;
        }

    }

    @Test
    void shouldSaveBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "dinesh");

        Bucket bucket = new Bucket(10, 2);

        repository.saveBucket(client, bucket);

        Bucket saved = repository.getBucket(client);

        assertNotNull(saved);
        assertEquals(10, saved.getCapacity());
    }

    @Test
    void shouldCreateBucketIfNotExists() {

        ClientIdentifier client = new ClientIdentifier(ClientType.USER, "john");

        Bucket bucket = repository.getOrCreateBucket(client, 20, 5);

        assertNotNull(bucket);
        assertEquals(20, bucket.getCapacity());
    }

    @Test
    void shouldReturnExistingBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.JWT, "user123");

        Bucket first = repository.getOrCreateBucket(client, 10, 2);

        Bucket second = repository.getOrCreateBucket(client, 100, 20);

        assertEquals(first.getCapacity(), second.getCapacity());
    }

    @Test
    void shouldContainBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.IP, "127.0.0.1");

        repository.saveBucket(client, new Bucket(5, 1));

        assertTrue(repository.containsBucket(client));
    }

    @Test
    void shouldDeleteBucket() {

        ClientIdentifier client = new ClientIdentifier(ClientType.API_KEY, "abc");

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