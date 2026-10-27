# 🎓 Academic Course Outcomes Compliance & Requirements: LIBRARY / DESK

**Project**: LIBRARY / DESK — Full-Stack Library Management System Workstation  
**Course Context**: Full-Stack Web Development / Academic Task 4 Compliance  

---

## 1. Course Outcomes Mapping Matrix (CO-1 to CO-5)

| Course Outcome | Academic Standard Description | Implemented Features & Modules | Verification in Codebase |
| :--- | :--- | :--- | :--- |
| **CO-1** | Design structured HTML, modern CSS layouts, responsive presentation, navigation, forms, and tables. | • Neo-brutalist retro desktop workstation shell.<br/>• Responsive flexbox & CSS grid layout (`DesktopShell.jsx`).<br/>• Accessible forms with inputs, selects, validation warnings.<br/>• Data tables with sticky headers, zebra stripes, and status tags.<br/>• Window-chrome modals, floating action bars, and toast alerts. | `src/components/Layout/`<br/>`src/components/UI/`<br/>`src/index.css`<br/>`tailwind.config.js` |
| **CO-2** | Develop dynamic React components, hooks, state management, form validation, and asynchronous events. | • React 18 component tree with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`).<br/>• Central application store (`useLibraryStore.js`) managing domain state and API communication.<br/>• Dynamic search and live filtering across catalogs, patrons, and circulation records.<br/>• Form input validation and safe rollback on error responses. | `src/hooks/useLibraryStore.js`<br/>`src/context/LibraryContext.jsx`<br/>`src/components/Books/`<br/>`src/components/Members/` |
| **CO-3** | Architect relational database schema, normalize tables, establish foreign-key constraints, execute SQL CRUD and JOIN queries. | • PostgreSQL 18 relational database schema version-controlled with Flyway (V1, V2).<br/>• Strict 1:N foreign keys (`categories->books`, `books->loans`, `members->loans`, `books->reservations`, `members->reservations`).<br/>• Check constraints, unique indexes on ISBN/Email/Codes.<br/>• Aggregate queries (`GROUP BY`, `SUM`, `COUNT`) and multi-table JOIN operations. | `backend/src/main/resources/db/migration/`<br/>`docs/DATABASE_DESIGN.md`<br/>`backend/src/main/java/com/librarydesk/repository/` |
| **CO-4** | Implement Spring Boot RESTful API, layered architecture, business services, DTOs, and automated testing. | • Spring Boot 3.3.5 layered architecture (`Controller` -> `Service` -> `Repository` -> `Entity`).<br/>• Input payload validation (`@Valid`, Jakarta constraints).<br/>• Comprehensive JUnit 5 and MockMvc test suite (20 automated tests passed).<br/>• Global exception handling (`@RestControllerAdvice`) returning standardized JSON envelopes. | `backend/src/main/java/com/librarydesk/`<br/>`backend/src/test/java/com/librarydesk/`<br/>`pom.xml` |
| **CO-5** | Implement JPA persistence, entity mappings, transactional boundaries, and documented REST client integration. | • JPA `@Entity`, `@ManyToOne`, `@OneToMany`, `@Version` optimistic locking.<br/>• `@Transactional` service methods guarding copy allocation and return logic.<br/>• Clean REST boundary consumed by central React API client (`src/api/`).<br/>• Interactive OpenAPI 3.0 / Swagger documentation. | `backend/src/main/java/com/librarydesk/model/`<br/>`src/api/`<br/>`backend/src/main/java/com/librarydesk/config/OpenApiConfig.java` |

---

## 2. Functional Requirements Checklist

- [x] **FR-1**: Book Catalog Management (Create, Read, Update, Delete with active loan protection).
- [x] **FR-2**: Member/Patron Directory (Registration, status toggle between ACTIVE and BLOCKED, deletion guards).
- [x] **FR-3**: Circulation System (Issue loans, calculate 14-day due dates, decrement inventory transactionally).
- [x] **FR-4**: Returns & Fines Processing (Increment inventory, prevent duplicate returns, calculate ₹5/day overdue fine).
- [x] **FR-5**: Hold Queue / Reservations (Place hold, queue numbering, auto-promotion to READY on return, fulfill into active loan).
- [x] **FR-6**: Taxonomy & Classification (Category CRUD with book reference deletion guards).
- [x] **FR-7**: Analytical Reporting (Overview summary, overdue fines breakdown, category inventory aggregates, popular titles, member loan history).
- [x] **FR-8**: Data Migration & Portability (Export JSON backup, import legacy browser localStorage data into PostgreSQL).
- [x] **FR-9**: Global Search (Instant multi-entity search for titles, patrons, loan codes).
- [x] **FR-10**: System Diagnostics (Real-time Spring Boot and PostgreSQL connection status indicators).

---

## 3. Non-Functional Requirements Checklist

- [x] **NFR-1 Consistency**: Relational database foreign keys and ACID transactions prevent orphan records or negative stock.
- [x] **NFR-2 Concurrency**: Optimistic locking (`@Version`) protects inventory from race conditions.
- [x] **NFR-3 Usability**: Retro neo-brutalist desktop aesthetic provides clear visual hierarchy and tactile feedback.
- [x] **NFR-4 Performance**: Fast production builds (Vite builds in ~1s; Spring Boot boots in ~5s; in-memory testing completes in ~10s).
- [x] **NFR-5 Security**: Parameterized queries eliminate SQL injection; credentials kept externalized via environment templates.
- [x] **NFR-6 Reproducibility**: Flyway version-controlled migrations and Maven wrapper guarantee consistent deployment across environments.
