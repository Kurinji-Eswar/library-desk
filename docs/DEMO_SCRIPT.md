# 🎙️ Demonstration & Viva Presentation Script: LIBRARY / DESK

**Purpose**: Guide for presenting LIBRARY / DESK to faculty examiners and project evaluators.  
**Demonstration Time**: 8 to 12 minutes  

---

## Act 1: The Concept & Visual Identity (1.5 mins)
1. **Open the browser**: Navigate to `http://localhost:5173`.
2. **Point out the design system**: Show the retro desktop operating system aesthetic (cream background, hard shadows, neo-brutalist ink borders, system clock, and top menu).
3. **Show the live status indicators**:
   - Point to the TopBar badge: **`SPRING BOOT + POSTGRESQL ONLINE`**
   - Point to the StatusFooter: **`POSTGRESQL 18 + HIKARICP · TRANSACTIONS PERSISTED`**
   - Explain that data is no longer stored only in localStorage; the frontend is fully integrated with a Spring Boot 3.3.5 REST API and PostgreSQL 18.

---

## Act 2: Book Catalog & Foreign Key Taxonomy (2.5 mins)
1. **Navigate to `BOOKS`**:
   - Filter by Category (e.g. `TECHNOLOGY`).
   - Use the live search bar: type "Clean".
2. **Demonstrate Create Book**:
   - Click `+ ADD BOOK`.
   - Enter details: Title: *"Modern Java in Action"*, Author: *"Raoul-Gabriel Urma"*, ISBN: *"978-1617293566"*, Category: *"TECHNOLOGY"*, Copies: 4.
   - Click `ADD BOOK`. Observe the green success toast: *"Saved to PostgreSQL catalog."*
3. **Demonstrate Duplicate ISBN Protection**:
   - Try to add another book with the exact same ISBN: *"978-1617293566"*.
   - Observe the server-side rejection toast: *"A book with ISBN ... already exists in catalog."*
4. **Demonstrate Deletion Protection**:
   - Attempt to delete a book with active loans (e.g. *The Great Gatsby*).
   - Observe the error alert: *"Cannot delete book because it has active or overdue loan(s)."*

---

## Act 3: Patron Directory & Borrowing Restrictions (2 mins)
1. **Navigate to `MEMBERS`**:
   - Search for a member by name or email.
2. **Demonstrate Status Toggle**:
   - Select patron *"Rahul Kumar"*.
   - Click `BLOCK MEMBER`. Status switches to `BLOCKED`.
3. **Demonstrate Business Rule Enforcement**:
   - Navigate to `LOANS` -> Click `+ ISSUE LOAN`.
   - Select *"Rahul Kumar"* and try to issue a book.
   - Observe server rejection: *"Cannot issue book to member because the membership status is BLOCKED."*
   - Return to `MEMBERS` and click `UNBLOCK MEMBER`.

---

## Act 4: Circulation, Real-Time Fines & Returns (2.5 mins)
1. **Issue a Loan**:
   - Select an available book (*"Atomic Habits"*).
   - Issue to *"Ananya S."*.
   - Observe available copy count decrement by 1 immediately.
2. **Demonstrate Returns & Overdue Calculation**:
   - Navigate to `RETURNS` view.
   - Locate an overdue loan (*LN-002* or *LN-004*).
   - Point out the automatically calculated late fine (calculated at ₹5.00/day overdue).
   - Click `PROCESS RETURN`.
   - Show that copies available increments back by 1 and the loan status becomes `RETURNED`.
   - Attempting to return the same loan again is rejected by server.

---

## Act 5: Hold Queue / Reservations & Auto-Promotion (1.5 mins)
1. **Navigate to `RESERVATIONS`**:
   - Show active hold queue with position numbering.
   - Create a reservation for a popular title.
   - Show how returning a book automatically promotes the first waiting patron to `READY` status.

---

## Act 6: Backend Architecture & OpenAPI / Swagger (2 mins)
1. **Open Swagger UI**: Navigate to `http://localhost:8080/swagger-ui.html`.
2. **Highlight the Architecture**:
   - Show the modular REST controllers (Books, Members, Categories, Loans, Reservations, Dashboard, Reports).
   - Show OpenAPI schemas and DTO models.
3. **Show Database Persistence**:
   - Open terminal and show `psql` running against `library_desk`.
   - Run `SELECT * FROM books;` to prove records are real and persisted.
4. **Show Automated Tests**:
   - Point to `docs/TEST_RESULTS.md` showing all 20 JUnit 5 & MockMvc tests passed.
