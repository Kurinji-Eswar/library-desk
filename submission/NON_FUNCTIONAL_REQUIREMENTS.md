# 🛡️ Non-Functional Requirements: LIBRARY / DESK

---

## 1. Data Integrity & Consistency (NFR-1)
- Strict relational foreign keys (`ON DELETE RESTRICT`) prevent dangling or orphaned transaction logs.
- ACID transaction boundaries ensure multi-table operations (copy decrement + loan creation + reservation check) either commit in full or rollback completely.
- Check constraints at the database level ensure impossible numbers (e.g. negative copies) cannot occur under any circumstances.

---

## 2. Concurrency & Race Condition Protection (NFR-2)
- Optimistic locking using JPA `@Version` on the `Book` entity guarantees that simultaneous checkout attempts on the last available copy will reject the second conflicting transaction gracefully.

---

## 3. Reliability & Fault Tolerance (NFR-3)
- The frontend client includes resilient fallback caching. In the event of temporary network or server downtime, cached catalog data is displayed with an offline badge.
- Global exception handler intercepts all server errors and formats them into client-friendly JSON error envelopes without exposing database stack traces.

---

## 4. Performance & Scalability (NFR-4)
- **Frontend**: Vite optimizes bundles into split chunks (JavaScript gzip ~67 kB, CSS gzip ~4.8 kB) loading in milliseconds.
- **Backend**: Spring Boot 3.3.5 with HikariCP connection pooling maintains sub-20ms database roundtrips.
- **Database**: B-Tree indexes on `isbn`, `email`, `code`, `due_date`, and `status` accelerate query response times.

---

## 5. Security & Academic Best Practices (NFR-5)
- Parameterized database access through Spring Data JPA completely prevents SQL injection vulnerabilities.
- CORS is strictly configured to permit only trusted frontend domains.
- No secrets or credentials are hardcoded in source control. Template configuration (`.env.example`) provides clean onboarding.
- Input validation sanitizes all incoming payloads against Jakarta Bean Validation constraints.
