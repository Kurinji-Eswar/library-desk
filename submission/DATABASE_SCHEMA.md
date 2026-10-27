# 📊 Database Schema Summary: LIBRARY / DESK

**Database**: PostgreSQL 18  
**Schema Version**: Flyway V1, V2  

---

## 1. Tables & Relationships

| Table Name | Primary Key | Foreign Keys | Key Constraints | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `categories` | `id` (BIGSERIAL) | None | `name UNIQUE`, `code UNIQUE` | Book genres & classifications |
| `books` | `id` (BIGSERIAL) | `category_id -> categories(id)` | `isbn UNIQUE`, `code UNIQUE`, `available_copies <= total_copies` | Physical catalog inventory |
| `members` | `id` (BIGSERIAL) | None | `email UNIQUE`, `member_code UNIQUE`, `status IN ('ACTIVE','BLOCKED')` | Library patron records |
| `loans` | `id` (BIGSERIAL) | `book_id -> books(id)`, `member_id -> members(id)` | `loan_code UNIQUE`, `due_date >= issue_date` | Borrow transactions & fines |
| `reservations`| `id` (BIGSERIAL) | `book_id -> books(id)`, `member_id -> members(id)` | `reservation_code UNIQUE` | Hold queue waitlist |

---

## 2. Foreign Key Behavior

All foreign keys use `ON DELETE RESTRICT` to guarantee that no book or member can be deleted while active dependencies (loans, reservations) exist.
