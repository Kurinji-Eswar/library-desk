# 📊 Automated Test Execution Evidence: LIBRARY / DESK

**Execution Date**: October 27, 2026  
**Environment**: Windows 11 · Oracle JDK 25 / Java 21 LTS · Apache Maven 3.9.9 · H2 In-Memory DB  
**Build Tool Command**: `mvn test` (or `& "C:\Users\ADMIN\.maven\apache-maven-3.9.9\bin\mvn.cmd" test`)  

---

## 1. Test Execution Summary

```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
[INFO] Running com.librarydesk.BookControllerIntegrationTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.250 s
[INFO] Running com.librarydesk.BookServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.042 s
[INFO] Running com.librarydesk.LibraryDeskApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.010 s
[INFO] Running com.librarydesk.LoanControllerIntegrationTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.081 s
[INFO] Running com.librarydesk.LoanServiceTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.218 s
[INFO] Running com.librarydesk.MemberServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.040 s
[INFO] Running com.librarydesk.ReservationServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.141 s

Results:

Tests run: 20, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  10.871 s
```

---

## 2. Test Breakdown Table

| Test Class | Test Method | Purpose | Result | Time |
| :--- | :--- | :--- | :--- | :--- |
| `LibraryDeskApplicationTests` | `contextLoads()` | Application context bootstrap | ✅ PASSED | 0.010s |
| `BookServiceTest` | `testCreateValidBook()` | Valid catalog insertion | ✅ PASSED | 0.045s |
| `BookServiceTest` | `testRejectDuplicateIsbn()` | Duplicate ISBN prevention | ✅ PASSED | 0.012s |
| `BookServiceTest` | `testUpdateBook()` | Update & copy sync | ✅ PASSED | 0.018s |
| `MemberServiceTest` | `testCreateMember()` | Patron registration | ✅ PASSED | 0.015s |
| `MemberServiceTest` | `testRejectDuplicateEmail()` | Unique email enforcement | ✅ PASSED | 0.009s |
| `MemberServiceTest` | `testToggleBlockMember()` | Status transition (ACTIVE/BLOCKED) | ✅ PASSED | 0.016s |
| `LoanServiceTest` | `testIssueAvailableBook()` | Loan issuance & stock reduction | ✅ PASSED | 0.038s |
| `LoanServiceTest` | `testRejectUnavailableBook()` | Prevent borrowing with 0 copies | ✅ PASSED | 0.021s |
| `LoanServiceTest` | `testRejectBlockedMember()` | Prohibit borrowing for blocked patrons | ✅ PASSED | 0.019s |
| `LoanServiceTest` | `testProcessReturnAndRejectDuplicate()` | Return processing & copy restock | ✅ PASSED | 0.032s |
| `LoanServiceTest` | `testOverdueFineCalculation()` | Overdue fine calculation (₹5/day) | ✅ PASSED | 0.025s |
| `ReservationServiceTest` | `testCreateReservation()` | Place hold & queue numbering | ✅ PASSED | 0.022s |
| `ReservationServiceTest` | `testRejectDuplicateActiveReservation()` | Prevent duplicate reservations | ✅ PASSED | 0.014s |
| `ReservationServiceTest` | `testCancelReservation()` | Hold cancellation | ✅ PASSED | 0.018s |
| `BookControllerIntegrationTest` | `testGetAllBooksEndpoint()` | GET `/api/books` returns 200 OK | ✅ PASSED | 0.120s |
| `BookControllerIntegrationTest` | `testCreateBookEndpoint()` | POST `/api/books` returns 201 Created | ✅ PASSED | 0.040s |
| `BookControllerIntegrationTest` | `testCreateBookValidationFailure()` | Validation error returns 422 | ✅ PASSED | 0.028s |
| `BookControllerIntegrationTest` | `testGetNonExistentBook()` | Missing ID returns 404 | ✅ PASSED | 0.015s |
| `LoanControllerIntegrationTest` | `testIssueLoanEndpoint()` | POST `/api/loans` returns 201 Created | ✅ PASSED | 0.081s |

**Total Tests**: 20 Passed · 0 Failed · 0 Skipped
