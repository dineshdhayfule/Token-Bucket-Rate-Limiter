# 🚀 Token Bucket Rate Limiter

A production-oriented **Token Bucket Rate Limiter** built with **Java 21**, **Spring Boot 3**, and **Redis**. The project demonstrates backend engineering concepts such as rate limiting, thread safety, distributed storage, REST APIs, and scalable system design.

---

## 📌 Features

- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation using `ReentrantLock`
- Per-user buckets
- Redis-backed bucket storage
- Configurable bucket capacity
- Configurable refill rate
- REST API
- JSON response
- Spring Profiles (`memory` / `redis`)
- Docker-based Redis setup
- Clean layered architecture using the Repository Pattern

---

## 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Spring Data Redis
- Redis
- Docker
- Maven
- REST API
- Git & GitHub

---

## 🏗️ Architecture

```
                Client
                   │
                   ▼
          Spring Boot REST API
                   │
                   ▼
             Bucket Service
                   │
                   ▼
          Bucket Repository
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
 InMemory Repository   Redis Repository
                              │
                              ▼
                            Redis
```

---

## 📁 Project Structure

```
src/main/java/com/dinesh/ratelimiter

├── algorithm
│   └── TokenBucketRateLimiter.java
│
├── config
│   └── RedisConfig.java
│
├── controller
│   └── BucketController.java
│
├── dto
│   └── RateLimitResult.java
│
├── model
│   └── Bucket.java
│
├── repository
│   ├── BucketRepository.java
│   ├── InMemoryBucketRepository.java
│   └── RedisBucketRepository.java
│
├── service
│   └── BucketService.java
│
└── TokenBucketRateLimiterApplication.java
```

---

## ⚙️ Configuration

### In-Memory Mode

```properties
spring.profiles.active=memory
```

### Redis Mode

```properties
spring.profiles.active=redis
```

---

## ▶️ Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter.git
cd Token-Bucket-Rate-Limiter
```

### 2. Start Redis

```bash
docker run -d --name redis-rate-limiter -p 6379:6379 redis:7-alpine
```

If the container already exists:

```bash
docker start redis-rate-limiter
```

### 3. Run the application

```bash
./mvnw spring-boot:run
```

Windows

```powershell
.\mvnw.cmd spring-boot:run
```

---

## 🧪 Test the API

### Request

```
GET /api/check?userId=dinesh
```

### Response

```json
{
  "allowed": true,
  "tokensRemaining": 19
}
```

### Browser

```
http://localhost:8080/api/check?userId=dinesh
```

### cURL

```bash
curl "http://localhost:8080/api/check?userId=dinesh"
```

### PowerShell

```powershell
Invoke-RestMethod "http://localhost:8080/api/check?userId=dinesh"
```

---

## 🚧 Roadmap

- ✅ Phase 1 – In-Memory Token Bucket
- ✅ Phase 2 – Redis Integration
- ⏳ Phase 3 – Multiple Client Strategies
- ⏳ Phase 4 – Admin APIs
- ⏳ Phase 5 – Metrics & Monitoring
- ⏳ Phase 6 – Docker Compose
- ⏳ Phase 7 – Testing
- ⏳ Phase 8 – CI/CD
- ⏳ Phase 9 – Deployment

---

## 🎯 Learning Outcomes

This project demonstrates:

- Thread-safe backend programming
- Rate limiting algorithms
- Repository Pattern
- Spring Dependency Injection
- Redis integration with Spring Boot
- JSON serialization
- Docker-based local development
- Production-oriented backend architecture

---

## 👨‍💻 Author

**Dinesh Dhayfule**

GitHub: https://github.com/dineshdhayfule