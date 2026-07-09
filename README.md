# 🚀 Token Bucket Rate Limiter

[![CI](https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter/actions/workflows/ci.yml/badge.svg)](https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter/actions/workflows/ci.yml)

> A production-oriented **Token Bucket Rate Limiter** built with **Java 21**, **Spring Boot 3**, **Redis**, and **Docker**, featuring a **React + Vite Admin Dashboard**. This project demonstrates backend engineering concepts such as rate limiting, concurrency, Redis integration, REST APIs, monitoring, testing, and scalable backend architecture.

---

# 📌 Features

- **Interactive Admin Dashboard (React + Vite)**
- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation using `ReentrantLock`
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
- Comprehensive Unit Testing
- Service Layer Testing
- Controller Testing
- Repository Testing
- Concurrency Testing
- Clean layered architecture
- Production-oriented design

---

# ⭐ Highlights

- Production-oriented Token Bucket implementation
- Redis-backed distributed bucket storage
- Thread-safe concurrency control
- Multiple client identification strategies
- RESTful APIs built with Spring Boot
- Metrics using Spring Boot Actuator & Micrometer
- Dockerized deployment
- Comprehensive testing using JUnit 5 & Mockito

---

# 🛠️ Tech Stack

**Backend & Infrastructure**
- Java 21
- Spring Boot 3
- Redis
- Docker & Docker Compose
- Maven
- JUnit 5 & Mockito
- Testcontainers
- REST API
- Spring Boot Actuator & Micrometer
- GitHub Actions (CI/CD)

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router

---

# 📁 Project Structure

```text
frontend/                 # React Admin Dashboard
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Dashboard views
│   ├── services/         # API integration
│   └── App.tsx
├── package.json
└── vite.config.ts

backend (Spring Boot)/
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
│   └── RateLimiterMetrics.java
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
│   ├── AdminService.java
│   └── BucketService.java
│
└── TokenBucketRateLimiterApplication.java

src/test/java/com/dinesh/ratelimiter

├── algorithm
│   └── TokenBucketRateLimiterTest.java
│
├── concurrency
│   └── ConcurrentRateLimiterTest.java
│
├── controller
│   ├── AdminControllerTest.java
│   └── BucketControllerTest.java
│
├── repository
│   ├── InMemoryBucketRepositoryTest.java
│   └── RedisBucketRepositoryTest.java
│
├── service
│   └── BucketServiceTest.java
│
└── TokenBucketRateLimiterApplicationTests.java
```

---

# ⚙️ Rate Limiting API

## Check Rate Limit

### Request

```http
GET /api/check?type=API_KEY&id=dinesh
```

### Example

```http
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

```http
GET /admin/users
```

## Get All Buckets

```http
GET /admin/buckets
```

## Get Bucket

```http
GET /admin/bucket?type=USER&id=dinesh
```

## Delete Bucket

```http
DELETE /admin/bucket?type=USER&id=dinesh
```

## Reset All Buckets

```http
POST /admin/reset
```

---

# 📊 Monitoring

Spring Boot Actuator endpoints:

```http
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
GET /actuator/prometheus
```

---

# 🧪 Testing

The project includes a comprehensive testing suite covering the major layers of the application.

## Test Categories

- Application Context Test
- Algorithm Unit Tests
- Service Layer Tests
- Controller Tests
- Repository Tests
- Concurrency Tests

## Current Test Status

```text
Tests Run : 48
Failures  : 0
Errors    : 0
```

## Concurrency Test

The rate limiter is validated under concurrent load.

Example:

```text
1000 Concurrent Requests

↓

100 Allowed

900 Blocked
```

This verifies:

- Thread Safety
- No Race Conditions
- Correct Token Consumption
- No Negative Token Counts

### Run Tests

#### Windows

```powershell
.\mvnw.cmd test
```

#### Linux / macOS

```bash
./mvnw test
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

Build and start the application (Backend on port `8080`, Frontend Dashboard on port `5173`):

```bash
docker compose up --build
```

Access the Admin Dashboard at: [http://localhost:5173](http://localhost:5173)

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

---

## Run Locally

### Start Redis

```bash
docker run -d --name redis-rate-limiter -p 6379:6379 redis:8-alpine
```

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

```http
GET /api/check?type=API_KEY&id=my-api-key
```

### JWT

```http
GET /api/check?type=JWT&id=user123
```

### IP Address

```http
GET /api/check?type=IP&id=192.168.1.15
```

### User

```http
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
- ✅ Phase 7 – Testing
- ✅ Phase 8 – GitHub Actions (CI/CD)
- ✅ Phase 9 – Interactive Admin Dashboard (Frontend)
- ⏳ Phase 10 – Deployment

---

# 🎯 Concepts Covered

## Concurrency

- Thread Safety
- Token Bucket Algorithm
- ReentrantLock
- ConcurrentHashMap
- ExecutorService
- CountDownLatch
- AtomicInteger

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

## Testing

- JUnit 5
- Mockito
- MockMvc
- Integration Testing
- Concurrency Testing

## DevOps

- Docker
- Docker Compose
- GitHub Actions (Coming Soon)

## System Design

- Rate Limiting
- Distributed Caching
- Client Identification
- Layered Architecture
- Scalability

---

# 👨‍💻 Author

**Dinesh Dhayfule**
