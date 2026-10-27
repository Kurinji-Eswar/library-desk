# 🎤 Presentation & Viva Outline: LIBRARY / DESK

**Topic**: Full-Stack Transformation of LIBRARY / DESK  
**Presentation Target Time**: 10 minutes  

---

## Slide / Topic Breakdown

### Slide 1: Title & Team Introduction (1 min)
- Project: LIBRARY / DESK — Full-Stack Library Management System
- Team Members & Specific Roles (Frontend, Backend, Database, QA).
- Academic context: Task 4 Course Outcomes CO-1 through CO-5.

### Slide 2: Problem Statement & Motivation (1.5 mins)
- Limitations of fragile client-only localStorage prototypes vs sterile legacy software.
- The need for an engaging, neo-brutalist retro desktop workstation with real server-side ACID transactions and relational persistence.

### Slide 3: System Architecture (2 mins)
- 3-Tier Layered Architecture: React 18 SPA <-> Spring Boot 3.3.5 REST API <-> PostgreSQL 18.
- Explain REST controller boundary, service layer business rules, JPA repository abstraction, and Flyway versioned migrations.

### Slide 4: Relational Database Design (1.5 mins)
- 5 normalized tables: `categories`, `books`, `members`, `loans`, `reservations`.
- Foreign keys (`ON DELETE RESTRICT`), unique constraints, check constraints.
- Multi-table JOIN queries and aggregate calculations (inventory by category, popular titles).

### Slide 5: Live Demonstration of Critical Workflows (2.5 mins)
- Workstation dashboard & status monitors (`SPRING BOOT + POSTGRESQL ONLINE`).
- Adding a book & duplicate ISBN rejection.
- Blocking a member & rejection of loan issuance to blocked members.
- Loan checkout & atomic copy decrement.
- Return processing, overdue late fine calculation (₹5/day), and waitlist promotion.

### Slide 6: Automated Testing & Quality Assurance (1 min)
- 20 automated tests passed in JUnit 5 & MockMvc.
- Isolated in-memory H2 testing ensuring repeatable CI/CD builds.

### Slide 7: Conclusion & Key Learnings (0.5 min)
- Successful full-stack transformation without altering the retro desktop UI.
- Summary of CO-1 to CO-5 fulfillment.
- Q&A with faculty.
