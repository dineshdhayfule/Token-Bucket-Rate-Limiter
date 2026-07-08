# 🚀 Token Bucket Rate Limiter

A production-oriented **Token Bucket Rate Limiter** built with **Java 21**, **Spring Boot 3**, **Redis**, and **Docker**. This project demonstrates backend engineering concepts such as rate limiting, concurrency, Redis integration, REST APIs, monitoring, and scalable backend architecture.

---

# 📌 Features

- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation
- Multiple Client Identification Strategies
  - API Key
  - JWT
  - IP Address
  - User
- Redis-backed bucket storage
- In-Memory bucket storage
- Admin APIs
- Metrics & Monitoring
- Configurable bucket capacity
- Configurable refill rate
- Docker & Docker Compose support
- Clean layered architecture
- Production-oriented design

---

# 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Redis
- Docker
- Docker Compose
- Maven
- REST API
- Spring Boot Actuator
- Micrometer
- Git & GitHub

---

# 📁 Project Structure

```
src/main/java/com/dinesh/ratelimiter

├── algorithm
│   └── TokenBucketRateLimiter.java
│
├── config
│   └── RedisConfig.java
│
├── controller
│   ├── BucketController.java
│   └── AdminController.java
│
├── dto
│   └── RateLimitResult.java
│
├── exception
│   ├── BucketNotFoundException.java
│   └── GlobalExceptionHandler.java
│
├── metrics
│
├── model
│   ├── Bucket.java
│   ├── ClientIdentifier.java
│   └── ClientType.java
│
├── repository
│   ├── BucketRepository.java
│   ├── InMemoryBucketRepository.java
│   └── RedisBucketRepository.java
│
├── service
│   ├── BucketService.java
│   └── AdminService.java
│
└── TokenBucketRateLimiterApplication.java
```

---

# ⚙️ Rate Limiting API

## Check Rate Limit

### Request

```
GET /api/check?type=API_KEY&id=dinesh
```

### Example

```
GET /api/check?type=USER&id=dinesh
```

### Response

```json
{
    "allowed": true,
    "tokensRemaining": 19
}
```

---

# 👥 Supported Client Types

| Client Type | Example |
|-------------|---------|
| API_KEY | `API_KEY` |
| JWT | `JWT` |
| IP | `IP` |
| USER | `USER` |

---

# 🔧 Admin APIs

## Get All Clients

```
GET /admin/users
```

## Get All Buckets

```
GET /admin/buckets
```

## Get Bucket

```
GET /admin/bucket?type=USER&id=dinesh
```

## Delete Bucket

```
DELETE /admin/bucket?type=USER&id=dinesh
```

## Reset All Buckets

```
POST /admin/reset
```

---

# 📊 Monitoring

Spring Boot Actuator endpoints:

```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
GET /actuator/prometheus
```

---

# ▶️ Running the Project

## Clone Repository

```bash
git clone https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter.git

cd Token-Bucket-Rate-Limiter
```

---

## Run with Docker (Recommended)

Build and start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop the containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

---

## Run Locally

Start Redis locally:

```bash
docker run -d --name redis-rate-limiter -p 6379:6379 redis:8-alpine
```

Run the application:

### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

---

# 🌍 Environment Variables

| Variable | Default |
|----------|---------|
| REDIS_HOST | localhost |
| REDIS_PORT | 6379 |
| RATE_LIMITER_CAPACITY | 20 |
| RATE_LIMITER_REFILL_RATE | 5 |
| SPRING_PROFILES_ACTIVE | redis |

---

# 🧪 Sample Requests

### API Key

```
GET /api/check?type=API_KEY&id=my-api-key
```

### JWT

```
GET /api/check?type=JWT&id=user123
```

### IP Address

```
GET /api/check?type=IP&id=192.168.1.15
```

### User

```
GET /api/check?type=USER&id=dinesh
```

---

# 🚧 Roadmap

- ✅ Phase 1 – In-Memory Token Bucket
- ✅ Phase 2 – Redis Integration
- ✅ Phase 3 – Multiple Client Strategies
- ✅ Phase 4 – Admin APIs
- ✅ Phase 5 – Metrics & Monitoring
- ✅ Phase 6 – Docker & Docker Compose
- ⏳ Phase 7 – Testing
- ⏳ Phase 8 – CI/CD
- ⏳ Phase 9 – Deployment

---

# 🎯 Concepts Covered

## Concurrency

- Thread Safety
- Token Bucket Algorithm

## Backend

- Spring Boot
- REST APIs
- Dependency Injection

## Storage

- Redis
- Repository Pattern

## Monitoring

- Spring Boot Actuator
- Micrometer
- Prometheus Metrics

## DevOps

- Docker
- Docker Compose

## System Design

- Rate Limiting
- Distributed Caching
- Client Identification
- Layered Architecture

---

# 👨‍💻 Author

**Dinesh Dhayfule**
