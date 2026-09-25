# 📚 LIBRARY / DESK

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **A Retro Library Management Workstation**
>
> A frontend-only Library Management System styled as a nostalgic, early-2000s personal computer desktop — cream paper backgrounds, mint surfaces, chunky black borders, hard offset shadows, and window-chrome "applications" for every library workflow.

> [!NOTE]
> This project is **100% frontend-only**. It has no backend, no database server, no authentication system, and no external APIs. All data lives locally in your browser's `localStorage`.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Data Model & LocalStorage](#-data-model--localstorage)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Deployment](#-deployment)
- [Limitations & Future Scope](#-limitations--future-scope)
- [Author & Owner](#-author--owner)
- [License](#-license)

---

## 🖥️ Overview

**LIBRARY / DESK** reimagines a library management system as a retro computer workstation. Instead of a conventional admin dashboard, the application presents each workflow — Books, Members, Loans, Returns, Reservations, Categories, Reports, and Settings — as its own interactive "application window," navigated from a persistent top system bar and a program-launcher sidebar.

It was designed and built as a portfolio-grade demonstration of a maintainable, component-driven React application with realistic CRUD workflows, client-side validation, and a fully working local-first data layer — with **no external server requirement**.

---

## ✨ Key Features

- 🖥️ **Desktop Workspace**: Live library status widgets, recent activity feed, "Today" panel (due loans, pending reservations), quick-action buttons, and desktop shortcuts.
- 📚 **Book Catalog**: Searchable and filterable collection table, abstract CSS-drawn book covers, detailed book windows with borrowing history, add/edit modal with validation (required fields, valid year, ISBN format, duplicate-ISBN guard), and safe delete (blocked while the book has active loans).
- 👥 **Member Directory**: Member directory with search/filter by status and membership type, member profile windows (current loans, reservations, borrowing history, total fines), block/unblock controls, and safe delete guards.
- 🔄 **Loan Management**: Checkout workflow with duplicate-loan prevention, blocked-member prevention, unavailable-book prevention, automatic due-date calculation (14-day default, editable), and live status (`ACTIVE`, `DUE TODAY`, `OVERDUE`, `RETURNED`).
- 📥 **Returns & Fines**: Dedicated check-in queue, automatic overdue fine calculation (₹5/day), and fine waiving actions.
- 📌 **Reservations**: Queue management with `WAITING` ➔ `READY` ➔ `FULFILLED` states, cancellation, and automatic "ready" notifications when a reserved book is checked in.
- 🏷️ **Category Manager**: Full CRUD operations with book count tracking per category and delete guards when books are assigned.
- 📊 **Analytics & Reports**: Visual client-side statistics including library overview, book utilization, category distribution, monthly borrowing/return activity, and top-borrowed books.
- ⚙️ **System & Settings**: Export complete dataset as a single JSON backup file and reset to the original demo dataset at any time.
- 🔍 **Global Search**: Instant search across books, members, and active loans from the top system bar.
- 🔔 **Toast Notification Stack**: Retro audio-visual style notifications for all user actions.
- 📱 **Responsive Design**: Collapsible sidebar, horizontal scroll safety, and window adjustments for desktop, tablet, and mobile screens.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **UI Library** | React 18 (JS / JSX) | Modern declarative component interface |
| **Build Tool** | Vite 5 | Fast HMR and bundle optimizer |
| **Styling** | Tailwind CSS 3 | Utility-first styling with retro custom CSS tokens |
| **State Management** | React Context & Hooks | Centralized custom hook (`useLibraryStore`) |
| **Persistence** | Web Browser `localStorage` | Local-first synchronous persistence layer |
| **Graphics & Icons** | SVG & CSS | Lightweight inline SVG icons and pure CSS covers |
| **Typography** | Google Fonts | *Space Mono*, *IBM Plex Mono*, and *Inter* |

---

## 📁 Project Architecture

```
library-desk/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Layout/          # App Shell: TopBar, Sidebar, Window Chrome, DesktopIcon, StatusFooter
│   │   ├── UI/              # Primitives: Button, Input, Select, Modal, Badge, StatBlock, Toast
│   │   ├── icons/           # Icon.jsx — Central inline SVG icon set
│   │   ├── Books/           # BooksView, BookTable, BookDetails, BookFormModal, BookCover
│   │   ├── Members/         # MembersView, MemberTable, MemberProfile, MemberFormModal
│   │   ├── Loans/           # LoansView, LoanTable, NewLoanModal
│   │   ├── Returns/         # ReturnsView
│   │   ├── Reservations/    # ReservationsView, NewReservationModal
│   │   ├── Categories/      # CategoriesView
│   │   ├── Reports/         # ReportsView, Bar progress visualizer
│   │   ├── Settings/        # SettingsView
│   │   └── DesktopView.jsx  # Main Desktop / Home Screen
│   ├── context/
│   │   └── LibraryContext.jsx # React Context wrapper exposing useLibrary()
│   ├── hooks/
│   │   ├── useLibraryStore.js # State container + CRUD & business rules logic
│   │   └── useLocalStorage.js # Generic localStorage synchronization hook
│   ├── data/
│   │   └── seedData.js        # Initial mock library records
│   ├── utils/
│   │   ├── dateUtils.js       # Date arithmetic and formatting utilities
│   │   └── libraryUtils.js    # UID generator, storage keys, persistence helpers
│   ├── App.jsx              # Main App entry wrapper
│   ├── main.jsx             # React DOM root render
│   └── index.css            # Tailwind directives + Retro styles & animations
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 💾 Data Model & LocalStorage

Data is stored locally under namespaced keys:

- `library_books`: Book catalog & stock counts
- `library_members`: Member profiles & status
- `library_loans`: Active & completed loan records
- `library_reservations`: Hold requests & queue positions
- `library_categories`: Book categories
- `library_schema_version`: Schema state marker

### Schema Overview

```typescript
Book {
  id: string,
  title: string,
  author: string,
  isbn: string,
  category: string,
  publisher: string,
  year: number,
  totalCopies: number,
  availableCopies: number,
  shelf: string,
  addedDate: string
}

Member {
  id: string,
  name: string,
  email: string,
  phone: string,
  membershipType: string,
  joinedDate: string,
  status: 'ACTIVE' | 'BLOCKED'
}

Loan {
  id: string,
  bookId: string,
  memberId: string,
  borrowedDate: string,
  dueDate: string,
  returnedDate?: string,
  status: 'ACTIVE' | 'RETURNED',
  fine: number
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v16.0 or higher) and **npm** installed on your machine.

- [Node.js Download](https://nodejs.org/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lakshara-Anand-VV/library-desk.git
   cd library-desk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the static production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `F1` | Open **Desktop / Home** |
| `F2` | Open **Books Application** |
| `F3` | Open **Members Application** |
| `F4` | Open **Loans Application** |
| `F5` | Open **Returns Queue** |
| `F6` | Open **Reservations Queue** |
| `F7` | Open **Categories Manager** |
| `F8` | Open **Reports & Analytics** |
| `F9` | Open **System Settings** |

---

## 🌐 Deployment

Because **LIBRARY / DESK** is a static frontend application, the generated `dist/` directory can be deployed to any static hosting provider:

- **Vercel**: Import the GitHub repo `Lakshara-Anand-VV/library-desk` — Vite preset auto-detected.
- **Netlify**: Set build command to `npm run build` and publish directory to `dist`.
- **GitHub Pages**: Deploy via `gh-pages` branch or GitHub Actions workflow.
- **Cloudflare Pages / Firebase Hosting**: Static HTML/JS deployment.

---

## 📌 Limitations & Future Scope

### Current Scope
- Frontend-only application without a backend API or server database.
- Browser `localStorage` persistence (clearing cache resets local changes unless exported).

### Future Roadmap
- Node.js / Express backend with PostgreSQL / MongoDB storage.
- User authentication (Librarian & Student roles).
- Barcode / QR scanner integration for fast book checkouts.
- Export reports to CSV and PDF formats.

---

## 👤 Author & Owner

Developed and Owned by **[Lakshara Anand V V](https://github.com/Lakshara-Anand-VV)**

- **GitHub Profile**: [Lakshara-Anand-VV](https://github.com/Lakshara-Anand-VV)
- **LinkedIn Profile**: [lakshara-anand](https://linkedin.com/in/lakshara-anand)
- **Repository**: [Lakshara-Anand-VV/library-desk](https://github.com/Lakshara-Anand-VV/library-desk)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
