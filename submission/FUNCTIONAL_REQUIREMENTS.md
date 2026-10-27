# ⚙️ Functional Requirements: LIBRARY / DESK

---

## 1. Catalog Management (FR-1)
- **FR-1.1**: Add a book with unique ISBN, title, author, category, publication year, total copies, and shelf location.
- **FR-1.2**: Update book attributes; automatically recalculate available copies without exceeding total copies or going below copies on loan.
- **FR-1.3**: Filter books by category and perform live text search across title, author, and ISBN.
- **FR-1.4**: Prohibit deletion of a book if active or overdue loans reference it.
- **FR-1.5**: Prohibit deletion of a book if active hold/reservations reference it.

---

## 2. Patron Management (FR-2)
- **FR-2.1**: Register new patrons with full name, unique email, phone, and membership tier (Standard/Premium).
- **FR-2.2**: Search patrons by name, email, phone, or membership code.
- **FR-2.3**: Toggle patron status between `ACTIVE` and `BLOCKED`.
- **FR-2.4**: Prohibit borrowing for any patron marked `BLOCKED`.
- **FR-2.5**: Prevent patron record deletion if active loans are associated with the patron.

---

## 3. Circulation & Loan Lifecycle (FR-3)
- **FR-3.1**: Issue an available book to an active patron; decrement available copies by 1 transactionally.
- **FR-3.2**: Reject loan requests when available copy count is 0.
- **FR-3.3**: Prevent duplicate active loans for the same book and patron.
- **FR-3.4**: Calculate scheduled return date (default 14 days from issue date).
- **FR-3.5**: Categorize active loans dynamically into `ACTIVE`, `DUE TODAY`, and `OVERDUE`.

---

## 4. Returns & Overdue Penalties (FR-4)
- **FR-4.1**: Process book returns; restock physical inventory by incrementing available copies by 1.
- **FR-4.2**: Prevent duplicate returns on already returned loans.
- **FR-4.3**: Assess late penalty at ₹5.00 per day for every day returned past the due date.
- **FR-4.4**: Support librarian fine waiving with audit tracking.
- **FR-4.5**: Automatically promote the first waiting reservation for the returned title to `READY` status.

---

## 5. Hold Queue / Reservations (FR-5)
- **FR-5.1**: Allow patrons to place reservations when a book is checked out.
- **FR-5.2**: Assign sequential FIFO queue position numbers.
- **FR-5.3**: Reject duplicate active reservations for the same patron and book.
- **FR-5.4**: Support reservation cancellation.
- **FR-5.5**: Fulfill reservations by converting them into active loans upon pickup.

---

## 6. Classification & Taxonomy (FR-6)
- **FR-6.1**: Maintain unique category codes and uppercase names.
- **FR-6.2**: Display live book count badges for each category.
- **FR-6.3**: Guard category deletion if titles in catalog still reference it.

---

## 7. Reports & Analytics (FR-7)
- **FR-7.1**: Real-time workstation dashboard metrics (Total holdings, Available, Borrowed, Overdue, Patrons).
- **FR-7.2**: Overdue loan report with calculated fines.
- **FR-7.3**: Category inventory aggregate breakdown (Titles, Total Copies, Available Copies, Borrowed Copies).
- **FR-7.4**: Top borrowed books ranking.
- **FR-7.5**: Individual patron circulation loan history.
