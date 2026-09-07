# City Central Library - Modern Management System

A responsive, production-quality Library Management System built with **React (Vite)**, **Tailwind CSS**, **React Context API**, **React Router DOM**, **Axios**, **React Hook Form**, **Yup**, **React Toastify**, **Day.js**, and **Google Books API**.

---

## 🌟 Key Highlights & Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **Roles**: `Admin` (Librarian/Staff) and `Member` (Library Patron).
- **Client-Side Form Validation**: Powered by `react-hook-form` and `yup`.
- **Token Security**: Tokens and active sessions stored in `localStorage` with automated session restoration.
- **Protected Routes**: Granular route guards (`/dashboard`, `/members`, `/borrows` restricted to Admin; `/my-borrows` for Member; `/books`, `/notifications` for all).
- **Instant Role Switcher**: Quick-toggle button in the navigation bar to preview both Admin and Member experiences during review.

### 2. 📊 Executive Dashboard (Module 2)
- **Real-Time Stat Cards**:
  - Total Books Cataloged (with unique titles count)
  - Active Members
  - Books Currently on Loan
  - Overdue Books & Total Pending Fines
- **Visual Analytics**: Top Genres distribution progress bar.
- **Recent Lending Activity Feed**: Live audit log of recent book issues, returns, and overdue statuses.
- **Quick Action Shortcuts**: Issue Book, Add Book, and Register Member buttons.

### 3. 📚 Book Catalog Management (Module 3 - Full CRUD)
- **CRUD Operations**: Add, Edit, Delete (with safety dialog preventing deletion of loaned books), and View Book Details.
- **Google Books API Integration**: Auto-fills Book Title, Author, ISBN, Category, High-Resolution Cover, and Synopsis.
- **Search & Filtering**:
  - Multi-field search (Title, Author, ISBN) with `useDebounce` hook.
  - Category / Genre filter dropdown.
  - Availability status filter (In Stock vs Out of Stock).
- **Display Modes**: Toggle between **Card Grid View** and **Table View**.
- **Pagination**: Configurable page sizes (8, 12, 24 items per page).

### 4. 👥 Member Management (Module 4 - Full CRUD)
- **CRUD Operations**: Register new members, edit contact profiles, and deactivate/delete accounts.
- **Fields**: Name, Email, Phone, Membership ID, Membership Date, Status (`Active` / `Inactive`).
- **Borrowing History**: View detailed loan history drawer per member (active loans, returned books, overdue fines).
- **Search & Status Filter**: Search by name, email, phone, or membership ID; filter by Active/Inactive.

### 5. 🔄 Borrow & Return Management (Module 5)
- **Issue Book**:
  - Checks real-time copy availability.
  - Prevents issuing to Inactive members.
  - Auto-calculates 14-day return due date (customizable).
  - Automatically decrements available copy count.
- **Return Book & Fine Calculation**:
  - Automatic calculation of days overdue and fine amount ($1.00/day).
  - Allows staff to record collected fines.
  - Automatically replenishes book stock upon return.
- **Status Tabs**: `All Records`, `Currently Borrowed`, `Overdue Books`, and `Returned`.

### 6. 🔔 Notification Center (Module 6)
- Automatically monitors:
  - **Overdue Books**
  - **Books Due Soon** (within 3 days)
  - **New Books Added**
- Unread badge counter with animated indicator.
- Slide-over notification drawer & dedicated `/notifications` page.
- Actions: Mark as Read, Mark All as Read, Clear Notifications, Filter by Type.

### 7. 🛡️ Error Handling & UX (Module 9)
- Standardized Axios interceptor handling `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`, and `Network Failures`.
- Informative empty states with call-to-action buttons.
- Animated loading spinners and skeleton placeholders (`CardSkeleton`, `TableSkeleton`).
- Colored Toast notifications via `react-toastify`.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 + Vite** | High-performance modern frontend framework and bundler |
| **Tailwind CSS v4** | Modern utility-first styling with responsive layouts |
| **React Context API** | Centralized state management (`AuthContext`, `BookContext`, `MemberContext`, `BorrowContext`, `NotificationContext`) |
| **React Router DOM v7**| Declarative routing with protected routes and navigation guards |
| **Axios** | REST API client with request/response interceptors |
| **React Hook Form + Yup** | Robust form state and schema-based client-side validation |
| **Google Books API** | Third-party REST API for book discovery & auto-fill |
| **React Toastify** | User feedback toast alerts |
| **Day.js** | Date formatting, relative time calculation, and overdue due-date diffing |
| **React Icons** | Clean UI iconography |

---

## 📁 Scalable Folder Structure

```
src/
├── assets/                  # Static media and icons
├── components/
│   ├── common/              # Reusable core UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FilterDropdown.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Select.jsx
│   │   ├── Skeleton.jsx
│   │   ├── StatCard.jsx
│   │   ├── Table.jsx
│   │   └── Textarea.jsx
│   ├── layout/              # App layout, responsive sidebar & navbar
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── books/               # Book cards, forms, details, Google Books modal
│   ├── members/             # Member forms & history drawer
│   ├── borrow/              # Issue & Return book dialogs with fine logic
│   └── notifications/       # Slide-over notification drawer
├── constants/               # Genres, roles, and rich initial seed data
├── context/                 # Context API state stores
├── hooks/                   # Custom hooks (useDebounce, usePagination, useAuth)
├── pages/                   # Application views
│   ├── auth/                # Login & Register
│   ├── Dashboard.jsx        # Admin overview
│   ├── Books.jsx            # Catalog management
│   ├── Members.jsx          # Member management
│   ├── BorrowRecords.jsx    # Staff loan operations
│   ├── MyBorrows.jsx        # Member personal reading history
│   ├── Notifications.jsx    # Notification center
│   └── NotFound.jsx         # 404 error page
├── routes/                  # AppRoutes & ProtectedRoute
├── services/                # Axios API client, Google Books API, Storage service
├── utils/                   # Fine calculator, formatters, Yup schemas
├── App.jsx                  # Root App provider composition
├── index.css                # Tailwind CSS imports & theme utilities
└── main.jsx                 # Vite application entrypoint
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Login Credentials

You can use the quick auto-fill buttons on the Login page or enter:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@library.com` | `password123` | Full CRUD on Books & Members, Issue/Return, Fines, Dashboard |
| **Member** | `member@library.com` | `password123` | Browse Catalog, Search Books, View Personal Loans & Fines |
