# 🚀 Token Bucket Rate Limiter

A production-oriented **Token Bucket Rate Limiter** built with **Java 21** and **Spring Boot 3**. This project demonstrates backend engineering concepts such as rate limiting, thread safety, REST APIs, and scalable architecture.

---

## 📌 Features

- Token Bucket Rate Limiting Algorithm
- Thread-safe implementation using `ReentrantLock`
- Per-user buckets
- Configurable bucket capacity
- Configurable refill rate
- REST API
- JSON response
- In-memory bucket storage
- Clean layered architecture

---

## 🛠️ Tech Stack

- Java 21
- Spring Boot 3
- Maven
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
│   └── Bucket.java
│
├── repository
│   └── BucketRepository.java
│
├── service
│   └── BucketService.java
│
└── RateLimiterApplication.java
```

---

## ⚙️ API

### Check Rate Limit

**Request**

```
GET /api/check?userId=dinesh
```

**Response**

```json
{
  "allowed": true,
  "tokensRemaining": 19
}
```

---

## ▶️ Running the Project

Clone the repository

```bash
git clone https://github.com/dineshdhayfule/Token-Bucket-Rate-Limiter.git
```

Navigate to the project

```bash
cd Token-Bucket-Rate-Limiter
```

Run the application

```bash
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

The application starts on

```
http://localhost:8080
```

---

## 🧪 Test the API

Browser

```
http://localhost:8080/api/check?userId=dinesh
```

Curl

```bash
curl "http://localhost:8080/api/check?userId=dinesh"
```

PowerShell

```powershell
Invoke-RestMethod "http://localhost:8080/api/check?userId=dinesh"
```

---

## 🚧 Roadmap

- ✅ Phase 1 - In-Memory Token Bucket
- ⏳ Phase 2 - Redis Integration
- ⏳ Phase 3 - Multiple Client Strategies
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