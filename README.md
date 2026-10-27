# 📚 LIBRARY / DESK — Full-Stack Edition

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Swagger](https://img.shields.io/badge/OpenAPI-3.0_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://Kurinji-Eswar.github.io/library-desk/)

> **A Retro Desktop Library Management System Workstation**
>
> A full-stack Library Management System designed as a nostalgic early-2000s desktop operating system — cream paper textures, mint highlights, ink-black chunky borders, hard offset shadows, window-chrome applications, and terminal status monitors. Backed by a high-performance **Java 21 & Spring Boot 3 REST API** with **PostgreSQL 18 relational persistence**, **Flyway versioned migrations**, and optimistic concurrency locking.

> [!NOTE]
> **Full-Stack Enterprise Architecture with Resilient Fallback**: All catalog items, patron profiles, circulation records, and hold queues persist in a normalized PostgreSQL database via Spring Data JPA. When running standalone or offline, the application seamlessly falls back to cached client storage.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
  - [Desktop Workspace](#1-desktop-workspace)
  - [Book Catalog & Shelf Management](#2-book-catalog--shelf-management)
  - [Patron Directory](#3-patron-directory)
  - [Circulation & Loan Records](#4-circulation--loan-records)
  - [Returns & Overdue Penalties](#5-returns--overdue-penalties)
  - [Holds & Reservations Queue](#6-holds--reservations-queue)
  - [Classification & Taxonomy](#7-classification--taxonomy)
  - [Analytics & Visual Reports](#8-analytics--visual-reports)
  - [System Utilities & Data Portability](#9-system-utilities--data-portability)
- [Design Aesthetics](#-design-aesthetics)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Data Model & Schema](#-data-model--schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🖥️ Overview

**LIBRARY / DESK** transforms traditional, sterile library administration into a tactile, retro desktop computing experience. Instead of basic tables, each workflow operates within an interactive application window equipped with authentic window title bars, control buttons, status indicators, and program launcher icons.

Designed as a production-quality, component-driven React application, it includes full business logic validation (ISBN uniqueness, borrowing limits, stock management, overdue fine tracking, reservation promotion, and deletion guards).

---

## ✨ Key Features & Modules

### 1. Desktop Workspace
- **System Dashboard**: Real-time summary cards displaying Total Catalog Size, Available Copies, Borrowed Stock, Overdue Items, Active Patrons, and Active Loans.
- **Quick Action Bar**: Instant shortcuts to Issue Loan, Add Book, Register Patron, and Process Return.
- **Today's Docket**: Date/time monitor with real-time indicators for loans due today and pending reservations.
- **Station Event Log**: Chronological live feed logging transactions (acquisitions, checkouts, returns, patron registrations).
- **Desktop Program Launcher**: Retro icon grid providing one-click navigation to any subsystem.

### 2. Book Catalog & Shelf Management
- **Search & Filter**: Real-time keyword filtering across title, author, ISBN, shelf location, and category tags.
- **Abstract CSS Book Covers**: Procedurally styled geometric book covers rendered via pure CSS.
- **Item Details**: Full bibliographic overview including publisher, publication year, shelf assignment, and checkout history.
- **Validation Engine**: Required fields, year validation, ISBN formatting, and duplicate ISBN detection.
- **Delete Protection**: Prevents deletion of any book with active loans in circulation.

### 3. Patron Directory
- **Patron Management**: Directory with search by name, email, phone, and patron ID.
- **Membership Tiers**: Support for General, Premium, Student, and Faculty tiers.
- **Suspension Controls**: Toggle active/blocked status to restrict borrowing privileges when needed.
- **Borrower Profile**: Detailed patron view displaying current loans, reservation holds, lifetime checkout history, and accumulated fines.
- **Safe Deletion**: Deletion blocked while patron has outstanding borrowed items.

### 4. Circulation & Loan Records
- **Checkout Engine**: Loan creation with automatic 14-day due date calculation (configurable).
- **Borrowing Guards**: Prevents loans if a copy is unavailable, patron is blocked, or patron already has the same title on loan.
- **Live Status Tracking**: Automatic status updates based on current date: `ACTIVE`, `DUE TODAY`, `OVERDUE`, `RETURNED`.
- **Searchable Loan Registry**: Search by Loan ID, title, or borrower name with status tab filtering.

### 5. Returns & Overdue Penalties
- **Check-In Queue**: Prioritized list of active loans sorted by due date urgency.
- **Fine Calculation**: Dynamic overdue fine computation at ₹5/day past the due date.
- **Settlement Actions**: Process returns with one-click collection or waive penalties.
- **Automatic Hold Promotion**: Returning a reserved book instantly marks the next waiting hold as `READY`.

### 6. Holds & Reservations Queue
- **Waitlist Tracking**: Queue position tracking (`#1`, `#2`, etc.) per book title.
- **State Machine**: Transitions through `WAITING` ➔ `READY` ➔ `FULFILLED` or `CANCELLED`.
- **One-Click Fulfillment**: Converts a ready reservation into an active loan with prefilled details.

### 7. Classification & Taxonomy
- **Category System**: Management of Dewey/subject classification tags with distinct retro color markers.
- **Holdings Counter**: Real-time counter of total copies assigned to each category.
- **Integrity Guard**: Blocks category deletion if books remain assigned to that category.

### 8. Analytics & Visual Reports
- **Collection Holdings**: Subject distribution progress bars visualizing relative volume across categories.
- **Circulation Distribution**: Breakdown of Active, Overdue, Due Today, and Returned loans.
- **Borrower Leaderboard**: Top active library borrowers ranked by checkout volume.
- **Pure CSS Visualizations**: Zero external charting dependencies for maximum speed and bundle efficiency.

### 9. System Utilities & Data Portability
- **JSON Backup Export**: Download the entire library database (books, members, loans, reservations, categories) as a single `.json` file.
- **Factory Demo Reset**: Restore the standard sample catalog and test dataset with one confirmation click.
- **Global Search**: System bar search with live dropdown across books, patrons, and active loans.
- **Retro Toast Notifications**: Multi-tone toast notifications (`success`, `warning`, `error`, `default`) for all operational feedback.

---

## 🎨 Design Aesthetics

- **Color Tokens**: Curated nostalgic palette:
  - Cream Paper: `#F1EBDD`
  - Soft Cream: `#E7E0D0`
  - Mint Surface: `#A8D8D6`
  - Ink Black: `#20201C`
  - Classic Cyan: `#0789B2`
  - Amber Gold: `#D58B62`
  - Grayish Muted: `#8E8B80`
- **Chunky Retro Shadows**: Hard offset shadows (`5px 5px 0 #20201C`, `3px 3px 0 #20201C`, `8px 8px 0 #20201C`) with solid 2px borders.
- **Paper & Grain Overlay**: Radial ambient lighting and fine SVG grain texture for physical desktop ambiance.
- **Typography**: Paired monospace and sans-serif fonts:
  - Headers & Displays: *Space Mono* & *IBM Plex Mono*
  - Body & Reading: *Inter*

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18.3](https://react.dev/) | Component architecture, custom hooks, and state management |
| **Bundler** | [Vite 5.4](https://vitejs.dev/) | Fast HMR dev server and optimized production build |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility styling paired with retro color tokens & box shadows |
| **Icons** | Custom Inline SVG | 30+ lightweight monochrome retro icons via [`Icon.jsx`](src/components/icons/Icon.jsx) |
| **Persistence** | Browser `localStorage` | Synchronous, local-first persistence with schema versioning |
| **Fonts** | Google Fonts | Space Mono, IBM Plex Mono, Inter |

---

## 📁 Project Architecture

```
library-desk/
├── public/
│   └── favicon.svg                  # Retro floppy-disk / book favicon
├── src/
│   ├── components/
│   │   ├── Books/                   # Book Catalog Module
│   │   │   ├── BookCover.jsx        # Procedural CSS geometric covers
│   │   │   ├── BookDetails.jsx      # Item profile & loan history
│   │   │   ├── BookFormModal.jsx    # Add / Edit book modal with validation
│   │   │   ├── BooksView.jsx        # Catalog explorer & filter view
│   │   │   └── BookTable.jsx        # Data grid table for books
│   │   ├── Categories/              # Taxonomy Module
│   │   │   └── CategoriesView.jsx   # Classification manager
│   │   ├── icons/                   # Custom Icons
│   │   │   └── Icon.jsx             # Unified SVG icon dictionary
│   │   ├── Layout/                  # Desktop Shell & Window Chrome
│   │   │   ├── DesktopIcon.jsx      # Desktop shortcut icons
│   │   │   ├── DesktopShell.jsx     # Master application shell
│   │   │   ├── Sidebar.jsx          # Collapsible program navigation
│   │   │   ├── StatusFooter.jsx     # Sticky desktop status footer
│   │   │   ├── TopBar.jsx           # Global system bar, clock & search
│   │   │   ├── Window.jsx           # Window frame wrapper
│   │   │   └── WindowTitleBar.jsx   # Window title & control buttons
│   │   ├── Loans/                   # Circulation Module
│   │   │   ├── LoansView.jsx        # Active circulation registry
│   │   │   ├── LoanTable.jsx        # Tabular loan records
│   │   │   └── NewLoanModal.jsx     # Checkout loan creation modal
│   │   ├── Members/                 # Patron Module
│   │   │   ├── MemberFormModal.jsx  # Patron registration modal
│   │   │   ├── MemberProfile.jsx    # Patron record & loan history
│   │   │   ├── MembersView.jsx      # Patron directory
│   │   │   └── MemberTable.jsx      # Tabular member records
│   │   ├── Reports/                 # Analytics Module
│   │   │   ├── Bar.jsx              # Retro horizontal progress bar
│   │   │   └── ReportsView.jsx      # Visual reports & statistics
│   │   ├── Reservations/            # Hold Module
│   │   │   ├── NewReservationModal.jsx # Hold placement modal
│   │   │   └── ReservationsView.jsx # Reservation waitlist manager
│   │   ├── Returns/                 # Check-In Module
│   │   │   └── ReturnsView.jsx      # Return queue & fine settlement
│   │   ├── Settings/                # Configuration Module
│   │   │   └── SettingsView.jsx     # Export, reset, and diagnostics
│   │   ├── UI/                      # Shared Retro Primitives
│   │   │   ├── Badge.jsx            # Status badges
│   │   │   ├── Button.jsx           # Retro tactile buttons
│   │   │   ├── EmptyState.jsx       # Blank state cards
│   │   │   ├── Input.jsx            # Themed input fields
│   │   │   ├── Modal.jsx            # Dialogs & ConfirmDialog
│   │   │   ├── Select.jsx           # Custom select controls
│   │   │   ├── StatBlock.jsx        # Highlight KPI counters
│   │   │   └── Toast.jsx            # System notification stack
│   │   └── DesktopView.jsx          # Main Desktop Station Dashboard
│   ├── context/
│   │   └── LibraryContext.jsx       # React Context provider & consumer hook
│   ├── data/
│   │   └── seedData.js              # Comprehensive initial dataset
│   ├── hooks/
│   │   ├── useLibraryStore.js       # Central state store & business logic
│   │   └── useLocalStorage.js       # Generic localStorage hook
│   ├── utils/
│   │   ├── dateUtils.js             # ISO date arithmetic & formatters
│   │   └── libraryUtils.js          # UID generator & storage persistence
│   ├── App.jsx                      # Root application wrapper
│   ├── index.css                    # Tailwind imports, CSS tokens & grain
│   └── main.jsx                     # Entry React DOM renderer
├── index.html                       # HTML5 entry with viewport & fonts
├── package.json                     # Project manifest & npm scripts
├── postcss.config.js                # PostCSS Tailwind plugin setup
├── tailwind.config.js               # Theme color tokens & hard shadows
└── vite.config.js                   # Vite React plugin configuration
```

---

## 💾 Data Model & Schema

All records are persisted under namespaced `localStorage` keys:

- `library_books`: Catalog inventory
- `library_members`: Patron records
- `library_loans`: Active and completed circulation records
- `library_reservations`: Hold queue records
- `library_categories`: Subject classification categories
- `library_schema_version`: Schema marker (v1)

### Types

```typescript
interface Book {
  id: string;               // e.g. "BK-1"
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  shelf: string;
  addedDate: string;        // ISO format
}

interface Member {
  id: string;               // e.g. "MB-1"
  name: string;
  email: string;
  phone: string;
  membershipType: 'General' | 'Premium' | 'Student' | 'Faculty';
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
}

interface Loan {
  id: string;               // e.g. "LN-1"
  bookId: string;
  memberId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: 'ACTIVE' | 'DUE TODAY' | 'OVERDUE' | 'RETURNED';
  fine: number;
}

interface Reservation {
  id: string;               // e.g. "RS-1"
  bookId: string;
  memberId: string;
  requestedDate: string;
  position: number;
  status: 'WAITING' | 'READY' | 'FULFILLED' | 'CANCELLED';
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.0 or higher recommended)
- **npm** (v7.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kurinji-Eswar/library-desk.git
   cd library-desk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

Create an optimized static production bundle in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Destination | Description |
| :---: | :--- | :--- |
| `F1` | **Desktop** | Main desktop workspace & activity docket |
| `F2` | **Books** | Book collection & catalog management |
| `F3` | **Members** | Patron directory & borrowing profiles |
| `F4` | **Loans** | Active circulation registry & checkouts |
| `F5` | **Returns** | Check-in queue & overdue fine collection |
| `F6` | **Reservations** | Hold queue & waitlist processing |
| `F7` | **Categories** | Subject classification taxonomies |
| `F8` | **Reports** | Analytics, distribution & borrowing stats |
| `F9` | **System** | Backup export & demo data reset |

---

## 🌐 Deployment

Because **LIBRARY / DESK** compiles to pure static HTML, JavaScript, and CSS, it can be deployed to any static host:

- **GitHub Pages**: Build and deploy via `gh-pages`:
  ```bash
  npm run deploy
  ```
- **Vercel**: Connect the repository for automatic preview and production deployments.
- **Netlify**: Set build command to `npm run build` and publish directory to `dist`.
- **Cloudflare Pages**: Connect the GitHub repo with the standard Vite framework preset.

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE).
