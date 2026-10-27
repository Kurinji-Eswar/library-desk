# 🏛️ Architecture Summary: LIBRARY / DESK

---

## 1. System Structure

LIBRARY / DESK implements a clean **Modular Monolithic Layered Architecture** with distinct presentation, business, and persistence boundaries:

```
[React 18 SPA]
    |
    | HTTPS / RESTful JSON Envelopes
    v
[CORS Filter & Spring Security / Spring Web]
    |
    v
[REST Controllers (@RestController)]
    |
    v
[Service Layer (@Service, @Transactional)]
    |
    v
[Data Access Layer (Spring Data JPA Repositories)]
    |
    v
[PostgreSQL 18 Database Engine]
```

---

## 2. Component Design

1. **Client Tier**:
   - Single-Page Application built on React 18 and Vite.
   - Central state hook `useLibraryStore` exposing reactive getters and asynchronous dispatchers.
   - Modular API client (`src/api/`) wrapping modern `fetch`.
2. **Server Tier**:
   - Spring Boot 3.3.5 running on embedded Tomcat.
   - Layered separation of concerns: Controller, Service, Repository, DTO, Entity.
   - Centralized exception translation via `@RestControllerAdvice`.
3. **Database Tier**:
   - PostgreSQL 18 with 5 normalized tables.
   - Flyway database migration tracking (`flyway_schema_history`).
   - Connection pooling managed via HikariCP.
