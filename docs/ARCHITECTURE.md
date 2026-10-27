# 🏗️ System Architecture & Layered Design: LIBRARY / DESK

---

## 1. Architectural Overview

LIBRARY / DESK is structured as a **3-Tier Full-Stack Application** designed for reliability, clarity, and academic compliance:

```
+-------------------------------------------------------------+
|                     PRESENTATION TIER                       |
|   React 18 SPA · Vite Bundler · Tailwind CSS Neo-Brutalist  |
|   Central API Client (Fetch / Async) · React Context Store  |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON REST
                              |
+-------------------------------------------------------------+
|                      APPLICATION TIER                       |
|   Spring Boot 3.3.5 · Java 21 LTS · Embedded Tomcat         |
|   REST Controllers · DTO Envelopes · Validation Layer       |
|   Service & Business Logic · @Transactional Isolation       |
+-------------------------------------------------------------+
                              |
                     HikariCP JDBC Connection
                              |
+-------------------------------------------------------------+
|                      PERSISTENCE TIER                       |
|   PostgreSQL 18 · Flyway Schema Migrations (V1, V2)         |
|   Spring Data JPA · Hibernate 6 ORM · Optimistic Locking    |
+-------------------------------------------------------------+
```

---

## 2. Layered Component Responsibilities

### 2.1 Presentation Tier (Frontend)
- **Component Shell (`DesktopShell.jsx`)**: Renders top window title bars, sidebar program launcher, active workstation views, status monitors, and toast notification stacks.
- **State Store (`useLibraryStore.js`)**: Encapsulates state for books, members, loans, reservations, and categories. Dispatches asynchronous REST requests to the backend while updating the UI optimistically and providing feedback.
- **API Services Layer (`src/api/`)**: Decoupled HTTP modules (`booksApi`, `membersApi`, `loansApi`, `reservationsApi`, `categoriesApi`, `dashboardApi`, `reportsApi`, `migrationApi`) wrapping standard `fetch` calls.

### 2.2 Application Tier (Backend)
- **Controller Layer (`com.librarydesk.controller`)**: Exposes RESTful HTTP endpoints, enforces CORS policy, and maps HTTP requests to service calls.
- **DTO Layer (`com.librarydesk.dto`)**: Strictly separates internal database entities from external wire representations. Enforces Jakarta Bean Validation rules (`@NotBlank`, `@Email`, `@Min`, `@NotNull`).
- **Service Layer (`com.librarydesk.service`)**: Implements authoritative business rules:
  - Copy availability verification before loan issuance
  - Membership status inspection (blocked members prohibited from borrowing)
  - Atomic copy increment/decrement
  - Overdue fine calculation at ₹5.00/day
  - Waitlist reservation promotion on return
- **Exception Boundary (`com.librarydesk.exception`)**: Catches validation, duplicate, and business exceptions via `@RestControllerAdvice` and converts them into standardized `ErrorResponse` objects with HTTP status codes (400, 404, 409, 422, 500).

### 2.3 Persistence Tier (Database)
- **JPA Repositories (`com.librarydesk.repository`)**: Extends `JpaRepository` with custom JPQL queries, derived finders, and aggregate reporting queries.
- **Relational Schema**: 5 normalized tables in PostgreSQL (`categories`, `books`, `members`, `loans`, `reservations`) equipped with foreign keys (`ON DELETE RESTRICT`), unique constraints, check constraints, and B-Tree indexes.
- **Migration Engine**: Flyway runs versioned DDL (`V1__create_schema.sql`) and seed DML (`V2__seed_demo_data.sql`) during application startup.

---

## 3. Concurrency & Transaction Management

1. **Transactional Boundaries**: Service mutation methods (`issueLoan`, `processReturn`, `createBook`, `fulfillReservation`) are annotated with `@Transactional`.
2. **Optimistic Locking**: The `Book` entity utilizes a `@Version Long version` attribute. Any concurrent transaction attempting to issue copies simultaneously will be checked at commit time, preventing race conditions.
3. **Data Integrity Guards**: Check constraints on the database level (`total_copies >= 0`, `available_copies >= 0 AND available_copies <= total_copies`) ensure impossible states are rejected at the lowest tier.
