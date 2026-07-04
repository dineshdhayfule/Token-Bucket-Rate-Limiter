# 🚀 Token Bucket Rate Limiter

A production-oriented **Token Bucket Rate Limiter** built with **Java 21**, **Spring Boot 3**, and **Redis**. This project demonstrates backend engineering concepts such as rate limiting, thread safety, REST APIs, distributed caching, and scalable architecture.

---

## 📌 Features

- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation
- Redis-backed bucket storage
- Multiple Client Support
  - API Key
  - JWT User
  - IP Address
  - Custom Client
- Configurable bucket capacity
- Configurable refill rate
- REST API
- JSON responses
- Clean layered architecture

---

## 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Redis
- Maven
- Spring Data Redis
- REST API
- Git & GitHub

---

## 📁 Project Structure

```
src/main/java/com/dinesh/ratelimiter

├── algorithm
│   └── TokenBucketRateLimiter.java
│
├── controller
│   └── BucketController.java
│
├── dto
│   └── RateLimitResult.java
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
│   └── BucketService.java
│
└── RateLimiterApplication.java
```

---

## ⚙️ API

### Check Rate Limit

### Request

```
GET /api/check?type=CLIENT&id=dinesh
```

### Supported Client Types

| Client Type | Example |
|-------------|---------|
| CLIENT | `/api/check?type=CLIENT&id=dinesh` |
| API_KEY | `/api/check?type=API_KEY&id=abc123` |
| JWT | `/api/check?type=JWT&id=user42` |
| IP | `/api/check?type=IP&id=192.168.1.10` |

---

### Sample Response

```json
{
  "allowed": true,
  "tokensRemaining": 19
}
```

---

## ▶️ Running the Project

### Clone the repository

```bash
git clone https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter.git
```

### Navigate into the project

```bash
cd Token-Bucket-Rate-Limiter
```

### Start Redis

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### Run the application

```bash
./mvnw spring-boot:run
```

The application starts on

```
http://localhost:8080
```

---

## 🧪 Test the API

### Browser

```
http://localhost:8080/api/check?type=CLIENT&id=dinesh
```

### Curl

```bash
curl "http://localhost:8080/api/check?type=CLIENT&id=dinesh"
```

### PowerShell

```powershell
Invoke-RestMethod "http://localhost:8080/api/check?type=CLIENT&id=dinesh"
```

---

## 🚧 Roadmap

- ✅ Phase 1 - In-Memory Token Bucket
- ✅ Phase 2 - Redis Integration
- ✅ Phase 3 - Multiple Client Support
- ⏳ Phase 4 - Admin APIs
- ⏳ Phase 5 - Metrics & Monitoring
- ⏳ Phase 6 - Docker
- ⏳ Phase 7 - Testing
- ⏳ Phase 8 - CI/CD
- ⏳ Phase 9 - Deployment

---

## 👨‍💻 Author

**Dinesh Dhayfule**

GitHub: https://github.com/dineshdhayfule