# 🗄️ Database Design & Relational Schema: LIBRARY / DESK

**Database Engine**: PostgreSQL 18  
**Migration Tool**: Flyway  
**Dialect**: PostgreSQLDialect  

---

## 1. Relational Tables & Field Specifications

### 1.1 `categories` Table
Stores classification taxonomies for cataloged titles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Surrogate auto-incrementing key |
| `code` | VARCHAR(32) | NOT NULL, UNIQUE | Human-readable identifier (e.g. `CAT-01`) |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Uppercase category name (e.g. `FICTION`) |
| `description` | TEXT | NULLABLE | Category description |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record update timestamp |

### 1.2 `books` Table
Stores titles, authors, edition metadata, and physical stock counts.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Surrogate auto-incrementing key |
| `code` | VARCHAR(32) | NOT NULL, UNIQUE | Business identifier (e.g. `BK-001`) |
| `isbn` | VARCHAR(32) | NOT NULL, UNIQUE | ISBN-10 or ISBN-13 identifier |
| `title` | VARCHAR(255) | NOT NULL | Title of the publication |
| `author` | VARCHAR(255) | NOT NULL | Author or contributors |
| `publisher` | VARCHAR(255) | NULLABLE | Publishing house |
| `publication_year`| INT | NOT NULL | Year of publication |
| `category_id` | BIGINT | NOT NULL, FK -> `categories(id)` | Foreign key reference |
| `total_copies` | INT | NOT NULL, CHECK (>= 0) | Total physical holdings |
| `available_copies`| INT | NOT NULL, CHECK (>= 0 AND <= total_copies) | Copies on shelf available to borrow |
| `shelf_location` | VARCHAR(64) | DEFAULT 'A1' | Physical shelf bay coordinates |
| `description` | TEXT | NULLABLE | Book summary / synopsis |
| `version` | BIGINT | NOT NULL, DEFAULT 0 | JPA Optimistic locking version |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record update timestamp |

### 1.3 `members` Table
Stores library patron profiles, contact information, and borrowing privileges.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Surrogate auto-incrementing key |
| `member_code` | VARCHAR(32) | NOT NULL, UNIQUE | Business identifier (e.g. `MB-001`) |
| `full_name` | VARCHAR(255) | NOT NULL | Patron full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Patron verified email address |
| `phone` | VARCHAR(64) | NULLABLE | Contact telephone |
| `address` | TEXT | NULLABLE | Physical mailing address |
| `membership_type`| VARCHAR(32) | NOT NULL, CHECK IN ('Standard', 'Premium') | Patron tier |
| `status` | VARCHAR(32) | NOT NULL, CHECK IN ('ACTIVE', 'BLOCKED') | Borrowing privilege status |
| `joined_at` | DATE | NOT NULL | Date membership was established |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record update timestamp |

### 1.4 `loans` Table (Circulation Transactions)
Records individual book borrow events, due dates, returns, and overdue penalties.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Surrogate auto-incrementing key |
| `loan_code` | VARCHAR(32) | NOT NULL, UNIQUE | Business identifier (e.g. `LN-001`) |
| `book_id` | BIGINT | NOT NULL, FK -> `books(id)` | Borrowed book reference |
| `member_id` | BIGINT | NOT NULL, FK -> `members(id)` | Borrowing patron reference |
| `issue_date` | DATE | NOT NULL | Date book was checked out |
| `due_date` | DATE | NOT NULL, CHECK (>= issue_date) | Scheduled return deadline |
| `return_date` | DATE | NULLABLE | Actual date book was returned |
| `status` | VARCHAR(32) | NOT NULL, CHECK IN ('ACTIVE', 'DUE TODAY', 'DUE_TODAY', 'OVERDUE', 'RETURNED') | Lifecycle status |
| `fine_amount` | NUMERIC(10,2)| NOT NULL, DEFAULT 0.00 | Assessed late return penalty in ₹ |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record update timestamp |

### 1.5 `reservations` Table (Hold Queue)
Manages patron reservation queues when all copies of a title are checked out.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGSERIAL | PRIMARY KEY | Surrogate auto-incrementing key |
| `reservation_code`| VARCHAR(32) | NOT NULL, UNIQUE | Business identifier (e.g. `RS-001`) |
| `book_id` | BIGINT | NOT NULL, FK -> `books(id)` | Requested title reference |
| `member_id` | BIGINT | NOT NULL, FK -> `members(id)` | Reserving patron reference |
| `reservation_date`| DATE | NOT NULL | Date reservation was submitted |
| `queue_position` | INT | NOT NULL, DEFAULT 1 | Priority position in waitlist |
| `status` | VARCHAR(32) | NOT NULL, CHECK IN ('WAITING', 'READY', 'FULFILLED', 'CANCELLED') | Status |
| `fulfilled_at` | TIMESTAMPTZ | NULLABLE | Timestamp when converted to loan |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record update timestamp |

---

## 2. Key Foreign Keys & Relationships

- **Category to Book (1:N)**: `books.category_id` -> `categories.id` (`ON DELETE RESTRICT`)
- **Book to Loan (1:N)**: `loans.book_id` -> `books.id` (`ON DELETE RESTRICT`)
- **Member to Loan (1:N)**: `loans.member_id` -> `members.id` (`ON DELETE RESTRICT`)
- **Book to Reservation (1:N)**: `reservations.book_id` -> `books.id` (`ON DELETE RESTRICT`)
- **Member to Reservation (1:N)**: `reservations.member_id` -> `members.id` (`ON DELETE RESTRICT`)

---

## 3. Essential SQL Demonstration Queries

### 3.1 Currently Borrowed Books with Patron Details (Multi-Table JOIN)
```sql
SELECT 
    l.loan_code,
    b.title,
    b.isbn,
    m.full_name AS borrower_name,
    m.email,
    l.issue_date,
    l.due_date,
    l.status
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.status != 'RETURNED'
ORDER BY l.due_date ASC;
```

### 3.2 Overdue Loans with Fine Calculations
```sql
SELECT 
    l.loan_code,
    b.title,
    m.full_name,
    l.due_date,
    CURRENT_DATE - l.due_date AS days_overdue,
    (CURRENT_DATE - l.due_date) * 5.00 AS calculated_fine
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.status != 'RETURNED' AND l.due_date < CURRENT_DATE
ORDER BY days_overdue DESC;
```

### 3.3 Book Inventory Breakdown by Category (Aggregate Grouping)
```sql
SELECT 
    c.name AS category_name,
    COUNT(b.id) AS total_titles,
    COALESCE(SUM(b.total_copies), 0) AS total_holdings,
    COALESCE(SUM(b.available_copies), 0) AS available_copies,
    COALESCE(SUM(b.total_copies - b.available_copies), 0) AS copies_on_loan
FROM categories c
LEFT JOIN books b ON b.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name ASC;
```

### 3.4 Most Frequently Borrowed Books (Popularity Ranking)
```sql
SELECT 
    b.title,
    b.author,
    c.name AS category,
    COUNT(l.id) AS total_times_borrowed
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN categories c ON b.category_id = c.id
GROUP BY b.id, b.title, b.author, c.name
ORDER BY total_times_borrowed DESC
LIMIT 5;
```

### 3.5 Member Circulation History
```sql
SELECT 
    l.loan_code,
    b.title,
    l.issue_date,
    l.due_date,
    l.return_date,
    l.status,
    l.fine_amount
FROM loans l
JOIN books b ON l.book_id = b.id
WHERE l.member_id = :memberId
ORDER BY l.id DESC;
```
