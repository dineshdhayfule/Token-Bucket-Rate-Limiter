# 🚀 Token Bucket Rate Limiter

A production-oriented **Token Bucket Rate Limiter** built with **Java 21** and **Spring Boot 3**. This project demonstrates backend engineering concepts such as rate limiting, concurrency, Redis integration, REST APIs, and scalable backend architecture.

---

# 📌 Features

- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation
- Multiple Client Identification Strategies
  - API Key
  - JWT
  - IP Address
  - Custom Client
- Redis-backed bucket storage
<<<<<<< HEAD
- Multiple Client Support
  - API Key
  - JWT User
  - IP Address
  - Custom Client
=======
- In-Memory bucket storage
- Admin APIs
>>>>>>> feature/admin-api
- Configurable bucket capacity
- Configurable refill rate
- Clean layered architecture
- Production-oriented design

---

# 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Redis
- Maven
- REST API
- Docker
- Git & GitHub

---

# 📁 Project Structure

```
src/main/java/com/dinesh/ratelimiter

├── algorithm
│   └── TokenBucketRateLimiter.java
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
└── RateLimiterApplication.java
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
GET /api/check?type=JWT&id=user123
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
|------------|---------|
| API_KEY | `API_KEY` |
| JWT | `JWT` |
| IP | `IP` |
| CLIENT | `CLIENT` |

---

# 🔧 Admin APIs

## Get All Clients

```
GET /admin/users
```

---

## Get All Buckets

```
GET /admin/buckets
```

---

## Get Bucket

```
GET /admin/bucket?type=API_KEY&id=dinesh
```

---

## Delete Bucket

```
DELETE /admin/bucket?type=API_KEY&id=dinesh
```

---

## Reset All Buckets

```
POST /admin/reset
```

---

# ▶️ Running the Project

## Clone Repository

```bash
git clone https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter.git
```

```
cd Token-Bucket-Rate-Limiter
```

---

## Start Redis

```bash
docker run -d --name redis-rate-limiter -p 6379:6379 redis:7-alpine
```

If Redis already exists:

```bash
docker start redis-rate-limiter
```

---

## Run with Redis Profile

Windows

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=redis"
```

Linux / macOS

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=redis
```

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

### IP

```
GET /api/check?type=IP&id=192.168.1.15
```

### Custom Client

```
GET /api/check?type=CLIENT&id=mobile-app
```

---

# 🧪 Admin API Examples

List Clients

```
GET /admin/users
```

Get Bucket

```
GET /admin/bucket?type=JWT&id=user123
```

Delete Bucket

```
DELETE /admin/bucket?type=JWT&id=user123
```

Reset All Buckets

```
POST /admin/reset
```

---

# 🚧 Roadmap

- ✅ Phase 1 - In-Memory Token Bucket
- ✅ Phase 2 - Redis Integration
- ✅ Phase 3 - Multiple Client Strategies
- ✅ Phase 4 - Admin APIs
- ✅ Phase 5 - Metrics & Monitoring
- ⏳ Phase 6 - Docker & Docker Compose
- ⏳ Phase 7 - Testing
- ⏳ Phase 8 - CI/CD
- ⏳ Phase 9 - Deployment

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
- In-Memory Repository Pattern

## System Design

- Rate Limiting
- Client Identification
- Repository Pattern
- Layered Architecture

---

# 👨‍💻 Author

**Dinesh Dhayfule**
