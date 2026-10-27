# 🎯 Problem Statement & Target Audience: LIBRARY / DESK

---

## 1. Problem Statement

Academic institutions and community libraries frequently grapple with library management software that suffers from two major extremes:
1. **Sterile, complex enterprise software**: Over-engineered systems with high training curves, unintuitive table-heavy forms, and high licensing costs.
2. **Fragile client-only prototypes**: Basic web demos with data confined to browser storage (`localStorage`), lacking concurrency control, relational integrity, data security, and multi-user persistence.

### Specific Technical Challenges Addressed:
- **Inventory Discrepancies**: Concurrent checkout requests leading to negative stock counts or phantom borrowings.
- **Data Integrity & Relational Isolation**: Loss of relational foreign keys causing orphaned loans when books or patrons are deleted.
- **Circulation Business Rules**: Inconsistent calculation of overdue fines, duplicate active loans, and inability to manage book waitlists.
- **Architectural Traceability**: Lack of clear service boundaries and transparent API documentation.

---

## 2. Target Audience & Personas

1. **Library Administrators & Head Librarians**:
   - Need high-level visibility into collection size, category distribution, total circulation, and overdue penalties.
   - Require reliable reporting and inventory auditing tools.
2. **Desk Attendants & Circulation Clerks**:
   - Need rapid, tactile workstation interactions for checking out and checking in titles.
   - Need instant validation alerts (e.g. blocked patrons, duplicate active borrowings, missing stock).
3. **Faculty & Academic Evaluators**:
   - Require clean, well-documented source code adhering to layered architectural principles.
   - Need verifiable test automation results, version-controlled database migrations, and OpenAPI documentation.
