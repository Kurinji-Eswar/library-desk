# 🧪 Automated Test Plan: LIBRARY / DESK

**Testing Frameworks**: JUnit 5, Spring Boot Test, MockMvc, AssertJ, H2 Database  

---

## 1. Test Strategy & Objectives

1. **Unit & Service Layer Tests**: Verify core business rules in isolation (inventory decrements, blocked member restrictions, duplicate checks, fine rates).
2. **Controller & Integration Tests**: Verify HTTP status codes (200, 201, 400, 404, 422), JSON payload deserialization, and Bean Validation error responses.
3. **Database Isolation**: Automated tests execute against an isolated in-memory H2 database (`application-test.properties`), ensuring tests are 100% repeatable without mutating production PostgreSQL data.
4. **Transaction Rollback**: Each test is wrapped in `@Transactional` to guarantee clean state for subsequent tests.

---

## 2. Test Cases Overview

### Book Service Test Suite (`BookServiceTest.java`)
- `testCreateValidBook`: Verifies valid creation, ISBN assignment, and copy initialization.
- `testRejectDuplicateIsbn`: Asserts `DuplicateResourceException` when saving existing ISBN.
- `testUpdateBook`: Asserts total copies update and available copies recalculation.

### Member Service Test Suite (`MemberServiceTest.java`)
- `testCreateMember`: Verifies patron registration, default ACTIVE status, and unique ID generation.
- `testRejectDuplicateEmail`: Asserts `DuplicateResourceException` on duplicate email address.
- `testToggleBlockMember`: Verifies state transition between ACTIVE and BLOCKED.

### Loan & Circulation Test Suite (`LoanServiceTest.java`)
- `testIssueAvailableBook`: Asserts loan creation and atomic inventory decrease.
- `testRejectUnavailableBook`: Asserts `BusinessRuleException` when copies available is 0.
- `testRejectBlockedMember`: Asserts `BusinessRuleException` when patron is BLOCKED.
- `testProcessReturnAndRejectDuplicate`: Asserts inventory replenishment and duplicate return rejection.
- `testOverdueFineCalculation`: Asserts fine calculated at ₹5.00/day overdue.

### Reservation Test Suite (`ReservationServiceTest.java`)
- `testCreateReservation`: Asserts waitlist queue position calculation.
- `testRejectDuplicateActiveReservation`: Asserts rejection of duplicate reservation for same book/member.
- `testCancelReservation`: Asserts status transition to CANCELLED.

### MockMvc Controller Integration Suite (`BookControllerIntegrationTest.java`, `LoanControllerIntegrationTest.java`)
- `testGetAllBooksEndpoint`: GET `/api/books` returns 200 OK.
- `testCreateBookEndpoint`: POST `/api/books` returns 201 Created.
- `testCreateBookValidationFailure`: POST invalid payload returns 422 Unprocessable Entity with field errors.
- `testGetNonExistentBook`: GET `/api/books/{id}` with bad ID returns 404 Not Found.
- `testIssueLoanEndpoint`: POST `/api/loans` returns 201 Created with loan metadata.
