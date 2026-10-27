# 📡 REST API Documentation: LIBRARY / DESK

**Base URL**: `http://localhost:8080/api`  
**Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
**OpenAPI Spec**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)  

---

## 1. Response Envelope Format

All successful responses follow the standard JSON envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-27T01:25:44.200Z"
}
```

Error responses:
```json
{
  "status": 400,
  "error": "Business Rule Violation",
  "message": "Cannot issue book to member because status is BLOCKED.",
  "path": "/api/loans",
  "timestamp": "2026-10-27T01:25:44.200Z",
  "validationErrors": null
}
```

---

## 2. Endpoints Summary

### 2.1 Book Endpoints (`/api/books`)

#### `GET /api/books`
- **Query Params**: `query` (string, optional), `category` (string, optional)
- **Response**: Array of `BookResponse`

#### `GET /api/books/{id}`
- **Path Param**: `id` (database ID, code like `BK-001`, or ISBN)
- **Response**: `BookResponse`

#### `POST /api/books`
- **Request Body**:
```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "isbn": "978-0134494166",
  "category": "TECHNOLOGY",
  "publisher": "Prentice Hall",
  "year": 2017,
  "totalCopies": 5,
  "shelf": "B1",
  "description": "Software structure and design guide."
}
```
- **Response**: 201 Created with created book object.

#### `PUT /api/books/{id}`
- **Request Body**: Full/partial `BookRequest`
- **Response**: 200 OK with updated book.

#### `DELETE /api/books/{id}`
- **Response**: 200 OK. Fails with 400 if active loans or reservations exist.

---

### 2.2 Member Endpoints (`/api/members`)

#### `GET /api/members`
- **Query Params**: `query` (name/email/code), `status` (`ACTIVE` or `BLOCKED`)
- **Response**: Array of `MemberResponse`

#### `POST /api/members`
- **Request Body**:
```json
{
  "name": "Karthik Raja",
  "email": "karthik.raja@mailbox.com",
  "phone": "+91 90000 10005",
  "address": "Madurai, TN",
  "membershipType": "Premium"
}
```
- **Response**: 201 Created with member profile.

#### `PATCH /api/members/{id}/toggle-status`
- **Response**: 200 OK with toggled status (`ACTIVE` <-> `BLOCKED`).

#### `DELETE /api/members/{id}`
- **Response**: 200 OK. Fails with 400 if patron has active loans.

---

### 2.3 Circulation & Loan Endpoints (`/api/loans`)

#### `GET /api/loans`
- **Query Params**: `status` (`ACTIVE`, `OVERDUE`, `DUE TODAY`, `RETURNED`)
- **Response**: Array of `LoanResponse`

#### `GET /api/loans/overdue`
- **Response**: Array of `LoanResponse` with computed overdue fines.

#### `POST /api/loans`
- **Request Body**:
```json
{
  "bookId": "BK-001",
  "memberId": "MB-001",
  "borrowedDate": "2026-10-27",
  "dueDate": "2026-11-10"
}
```
- **Response**: 201 Created. Decrements available copies by 1.

#### `POST /api/loans/{id}/return`
- **Request Body**:
```json
{
  "waiveFine": false,
  "returnDate": "2026-10-27"
}
```
- **Response**: 200 OK. Restocks book available copies and assesses fine if late.

---

### 2.4 Reservation Endpoints (`/api/reservations`)

#### `GET /api/reservations`
- **Query Params**: `status` (`WAITING`, `READY`, `FULFILLED`, `CANCELLED`)

#### `POST /api/reservations`
- **Request Body**:
```json
{
  "bookId": "BK-006",
  "memberId": "MB-003",
  "requestedDate": "2026-10-27"
}
```
- **Response**: 201 Created with queue position.

#### `POST /api/reservations/{id}/cancel`
- **Response**: 200 OK with `status: "CANCELLED"`.

#### `POST /api/reservations/{id}/fulfill`
- **Response**: 200 OK. Issues loan and sets `status: "FULFILLED"`.

---

### 2.5 Report & Dashboard Endpoints

- `GET /api/dashboard/summary`: Workstation stats (Total, Available, Borrowed, Overdue, Patrons).
- `GET /api/dashboard/recent-activity`: Live chronological transaction feed.
- `GET /api/reports/overview`: Comprehensive statistics.
- `GET /api/reports/inventory-by-category`: Category aggregates (Titles, Total, Available, Borrowed).
- `GET /api/reports/popular-books`: Ranking by loan count.
- `GET /api/reports/member-loan-history/{memberId}`: Circulation history for a specific patron.

---

### 2.6 Data Migration (`/api/migration`)

#### `POST /api/migration/import`
- **Request Body**: JSON containing `categories`, `books`, `members`, `loans`.
- **Response**: Summary of imported vs skipped duplicate records.
