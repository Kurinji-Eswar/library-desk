# 🌐 REST API Endpoints Summary: LIBRARY / DESK

**Server Host**: `http://localhost:8080`  
**Swagger UI**: `http://localhost:8080/swagger-ui.html`  

---

| HTTP Method | Endpoint | Purpose | Key Parameters / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | List & filter books | `query` (title/author/ISBN), `category` |
| **GET** | `/api/books/{id}` | Get book details | `id` (numeric ID, code, or ISBN) |
| **POST** | `/api/books` | Add book to catalog | `BookRequest` (title, author, isbn, copies) |
| **PUT** | `/api/books/{id}` | Update book details | `BookRequest` |
| **DELETE** | `/api/books/{id}` | Remove book | Guarded against active loans |
| **GET** | `/api/members` | List patrons | `query`, `status` (`ACTIVE`/`BLOCKED`) |
| **POST** | `/api/members` | Register patron | `MemberRequest` (name, email, phone) |
| **PATCH** | `/api/members/{id}/toggle-status` | Toggle status | `ACTIVE` <-> `BLOCKED` |
| **DELETE** | `/api/members/{id}` | Delete patron | Guarded against active loans |
| **GET** | `/api/categories` | List categories | Includes real-time `bookCount` |
| **POST** | `/api/categories` | Add category | `CategoryRequest` (name, description) |
| **DELETE** | `/api/categories/{id}` | Delete category | Guarded against assigned books |
| **GET** | `/api/loans` | Circulation loans | `status` (`ACTIVE`, `OVERDUE`, etc.) |
| **GET** | `/api/loans/overdue` | Overdue loans list | With calculated fines |
| **POST** | `/api/loans` | Issue a book loan | `LoanRequest` (bookId, memberId, dates) |
| **POST** | `/api/loans/{id}/return` | Process book return | `ReturnRequest` (`waiveFine`, `returnDate`) |
| **GET** | `/api/reservations` | Hold queue list | `status` (`WAITING`, `READY`, etc.) |
| **POST** | `/api/reservations` | Place book hold | `ReservationRequest` (bookId, memberId) |
| **POST** | `/api/reservations/{id}/cancel` | Cancel hold | Status -> `CANCELLED` |
| **POST** | `/api/reservations/{id}/fulfill` | Fulfill reservation | Converts to active loan |
| **GET** | `/api/dashboard/summary` | Workstation metrics | Total books, available, borrowed, fines |
| **GET** | `/api/dashboard/recent-activity` | Event log feed | Real-time audit transactions |
| **GET** | `/api/reports/overview` | Comprehensive report | Full collection statistics |
| **GET** | `/api/reports/inventory-by-category` | Category breakdown | Title count, copies, borrowed |
| **GET** | `/api/reports/popular-books` | Popular titles | Borrow counts ranking |
| **GET** | `/api/reports/member-loan-history/{id}` | Member history | Patron borrowing timeline |
| **POST** | `/api/migration/import` | Migrate local data | Imports localStorage into PostgreSQL |
