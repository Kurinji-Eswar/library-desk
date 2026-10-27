# 📚 PROJECT SUMMARY: LIBRARY / DESK (Enhanced Edition)

**Project Name**: LIBRARY / DESK  
**Repository**: [https://github.com/Kurinji-Eswar/library-desk](https://github.com/Kurinji-Eswar/library-desk)  
**Live Frontend**: [https://kurinji-eswar.github.io/library-desk/](https://kurinji-eswar.github.io/library-desk/)  
**Technology Stack**: React 18, Vite 5, Tailwind CSS, Java 21 LTS, Spring Boot 3.3.5, Spring Data JPA, PostgreSQL 18, Flyway, HikariCP, OpenAPI / Swagger, JUnit 5.  

---

## 1. Executive Summary

LIBRARY / DESK is an enterprise-grade, full-stack Library Management System engineered as a retro desktop workstation operating system. The project resolves the critical limitations of standard web apps by marrying an engaging, tactile user experience with a robust, production-grade layered architecture.

Built to fulfill academic requirements (CO-1 through CO-5), the system demonstrates complete client-server separation, normalized relational database design with PostgreSQL, versioned schema migrations via Flyway, transactional business rule enforcement in Spring Boot services, optimistic concurrency locking, and thorough test automation.

---

## 2. Core Capabilities

1. **Retro Desktop Workstation**: Neo-brutalist paper aesthetic, multi-window navigation, top menus, and live terminal status bars.
2. **Book Catalog Management**: Full CRUD with unique ISBN validation, category classification, copy allocation, and deletion safety guards.
3. **Patron Directory**: Member registration, unique email constraint, membership tiers (Standard/Premium), and dynamic status toggling (ACTIVE / BLOCKED).
4. **Circulation Engine**: Real-time borrowing, transactional inventory decrement, 14-day due date computation, and overdue fine assessment (₹5.00/day).
5. **Returns Processing**: Restocking physical copies, duplicate return prevention, and automatic hold queue promotion.
6. **Reservation Hold Queue**: FIFO waitlist numbering, status lifecycle (`WAITING` -> `READY` -> `FULFILLED`), and reservation fulfillment into active loans.
7. **Reports & Analytics**: Aggregates across inventory by category, popular books ranking, member loan history, and outstanding fine totals.
8. **Data Migration**: Backward compatibility engine capable of migrating legacy browser `localStorage` records into PostgreSQL.

---

## 3. Academic Compliance Verification

- **CO-1 (HTML/CSS Presentation)**: 100% Satisfied (Retro window chrome, responsive CSS grid/flexbox, neo-brutalist design tokens).
- **CO-2 (React Architecture)**: 100% Satisfied (React 18 hooks, context store, optimistic rendering, form validation).
- **CO-3 (Relational Database & SQL)**: 100% Satisfied (PostgreSQL 18 schema, Flyway V1/V2, foreign keys, constraints, multi-table JOINs).
- **CO-4 (Spring Boot Layered Backend)**: 100% Satisfied (Controllers, Services, Repositories, DTOs, 20 JUnit 5/MockMvc tests passed).
- **CO-5 (JPA & Integrated Boundary)**: 100% Satisfied (JPA entity relations, `@Version` locking, `@Transactional` boundaries, central React API client).
