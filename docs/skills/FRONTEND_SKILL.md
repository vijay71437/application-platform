---
name: application-platform-frontend
description: >
  Comprehensive skill and design reference for the Application Platform React frontend.
  Use this skill when working on, designing, or extending the frontend web application at
  /Users/vijaykumarmali/Documents/projects/application-platform/frontend.
  Covers React 19 architecture, design system, UI components, authentication lifecycle,
  API client patterns, routing guards, and the complete finance service integration.
---

# Application Platform — Frontend Skill & Design Architecture

## Overview

A modern, high-performance **React 19 / Vite 8** Single Page Application (SPA) providing:
- **Core Platform UI**: Authentication, user directory, RBAC role & permission administration.
- **Finance Service**: Personal finance hub, multi-currency accounts, categorized transaction ledger, recurring subscription automation & batch occurrence generation.
- **Stateless Token Authentication**: Automatic silent access token refresh with Axios request queuing.
- **Design System**: Lightweight, responsive UI components (Buttons with loading states, Badges, Modals, Stat Cards, Data Tables, Toast Notifications, Lucide React icons).

---

## Project Location & Scripts

```
/Users/vijaykumarmali/Documents/projects/application-platform/frontend/
```

- **Entry Point:** `src/main.jsx` → `src/App.jsx` → `src/routes/AppRoutes.jsx`
- **Development Server:** `npm run dev` (Vite dev server)
- **Production Build:** `npm run build`
- **API Base URL Config:** `src/config/env.js` (reads `VITE_API_BASE_URL` from `.env`, defaults to `http://localhost:8080/api/v1`)

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| UI Framework | React 19.2.8 | Functional components, hooks |
| Build Tool | Vite 8.3.0 | Fast HMR, ESM bundling |
| Routing | React Router v7.18.4 | Client-side routing with nested layouts and route guards |
| HTTP Client | Axios 1.20.0 | Interceptors for Bearer JWT, correlation ID, and silent token refresh |
| Icons | Lucide React | Clean, modern vector icons |
| State Management | React Context | `AuthContext` (session auth), `NotificationContext` (toast alerts) |
| Async Querying | @tanstack/react-query | Ready for server-state caching |
| Styling | CSS3 (Modern Vanilla) | Custom design system (`ui.css`, `AppLayout.css`, `index.css`) |

---

## Directory Architecture

```
frontend/src/
├── api/
│   ├── apiClient.js          # Axios instance with auth + refresh interceptors + X-Request-ID
│   ├── apiError.js           # Error normalizer extracting backend message & errorCode
│   └── apiResponse.js        # Standard ApiResponse wrapper helpers
│
├── auth/
│   ├── AuthContext.jsx       # Context provider for user session, login, logout
│   ├── authorization.js      # hasRole, hasAnyRole, hasPermission helpers
│   ├── authStorage.js        # sessionStorage wrapper for auth state
│   ├── authToken.js          # Token getters & setters for Axios interceptors
│   └── authTypes.js          # Auth initial states
│
├── components/
│   ├── notifications/
│   │   └── NotificationContext.jsx # Toast notification alert provider & container
│   ├── permissions/          # PermissionForm
│   ├── roles/                # RoleForm
│   ├── users/                # UserForm
│   └── ui/                   # Reusable Design System components
│       ├── Badge.jsx         # Status tags (success, danger, warning, info, purple, neutral)
│       ├── Button.jsx        # Buttons (variants, sizes, loading state, icon slots)
│       ├── Card.jsx          # Container card with borders and subtle shadows
│       ├── Modal.jsx         # Accessible modal dialog with backdrop blur & Escape key
│       ├── PageHeader.jsx    # Top header with title, subtitle, and action buttons
│       └── ui.css            # Component library stylesheets & finance design classes
│
├── config/
│   └── env.js                # Environment variable reader
│
├── layouts/
│   ├── AppLayout.jsx         # Sidebar navigation, topbar with profile, mobile drawer
│   └── AppLayout.css         # Layout styling, mobile breakpoints
│
├── pages/
│   ├── DashboardPage.jsx     # Main landing dashboard with system + finance snapshot
│   ├── LoginPage.jsx         # Modern split-screen login page
│   ├── RegisterPage.jsx      # Account registration page
│   ├── UsersPage.jsx         # User directory with search, filter, pagination
│   ├── RolesPage.jsx         # Admin roles list
│   ├── PermissionsPage.jsx   # Admin permissions catalog
│   ├── AdminPage.jsx         # Admin control panel
│   └── finance/              # Personal Finance Module Pages
│       ├── FinanceDashboardPage.jsx   # Main finance hub (net worth, cash flow, categories, recent txs)
│       ├── FinanceAccountsPage.jsx    # Bank/savings/credit/investment account cards & creator
│       ├── FinanceTransactionsPage.jsx# Full ledger, advanced multi-field search, modals
│       ├── FinanceCategoriesPage.jsx  # Income & expense classification groups
│       └── FinanceRecurringPage.jsx   # Subscriptions, pending occurrences queue & generator
│
├── routes/
│   ├── AppRoutes.jsx         # Central router definition
│   ├── ProtectedRoute.jsx    # Requires authenticated user or redirects to /login
│   ├── RequireRole.jsx       # Route guard checking user role (e.g., ROLE_ADMIN)
│   └── RequirePermission.jsx # Route guard checking specific permission (e.g., USER_READ)
│
├── services/
│   ├── authService.js        # Auth REST calls (login, register, refresh, logout, changePassword)
│   ├── financeService.js     # All finance REST calls (accounts, categories, tx, recurring)
│   ├── userService.js        # User CRUD & role assignment calls
│   ├── roleService.js        # Role management calls
│   └── permissionService.js  # Permission catalog calls
│
└── utils/
    └── formatters.js         # formatCurrency (₹, $, €, £), formatDate, formatDateTime
```

---

## Route Map & Access Control

| Route | Page Component | Access Guard | Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Credentials authentication |
| `/register` | `RegisterPage` | Public | New account registration |
| `/` | `DashboardPage` | `ProtectedRoute` | Core overview + finance snapshot |
| `/users` | `UsersPage` | `USER_READ` | User directory table with pagination |
| `/users/new` | `CreateUserPage` | `USER_CREATE` | User onboarding form |
| `/users/:id/edit`| `EditUserPage` | `USER_UPDATE` | Edit existing user details |
| `/users/:id/roles`| `UserRolesPage`| `ROLE_ADMIN` | Assign system roles to user |
| `/finance` | `FinanceDashboardPage` | `ProtectedRoute` | Personal finance overview & analytics |
| `/finance/accounts` | `FinanceAccountsPage` | `ProtectedRoute` | Manage accounts & balances |
| `/finance/transactions`| `FinanceTransactionsPage`| `ProtectedRoute`| Searchable ledger & entry modal |
| `/finance/categories` | `FinanceCategoriesPage` | `ProtectedRoute`| Income & expense categories |
| `/finance/recurring` | `FinanceRecurringPage` | `ProtectedRoute`| Recurring bills & pending occurrences |
| `/roles` | `RolesPage` | `ROLE_ADMIN` | Manage system roles |
| `/roles/new` | `CreateRolePage` | `ROLE_ADMIN` | Define new role |
| `/roles/:id/edit` | `EditRolePage` | `ROLE_ADMIN` | Edit role details |
| `/roles/:id/permissions`| `RolePermissionsPage`| `ROLE_ADMIN`| Attach permissions to role |
| `/permissions` | `PermissionsPage` | `ROLE_ADMIN` | Permission catalog |
| `/admin` | `AdminPage` | `ROLE_ADMIN` | Admin portal |

---

## Finance Module Architecture

### 1. `financeService.js` API Integration
All finance functions return clean unwrapped payloads (`response.data.data`):

```javascript
import {
    getAccounts,
    createAccount,
    getCategories,
    createCategory,
    getTransactions,
    searchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlySummary,
    getCategoryExpenseBreakdown,
    getRecurringTransactions,
    createRecurringTransaction,
    pauseRecurringTransaction,
    resumeRecurringTransaction,
    deactivateRecurringTransaction,
    generateOccurrences,
    getPendingOccurrences,
    confirmOccurrence,
    skipOccurrence,
} from "../services/financeService";
```

### 2. Finance Hub (`/finance`)
- **Metric Cards**: Net Financial Worth, Monthly Income, Monthly Expense, Net Savings Rate.
- **Cash Flow Ratio Track**: Visual progress bar showing percentage of income versus expense.
- **Category Expense Breakdown**: Progress bars showing top expense categories.
- **Pending Occurrences Banner**: Direct callout when scheduled bills require user confirmation.
- **Recent Transactions Feed**: Live stream of latest debit/credit transactions.

### 3. Accounts Ledger (`/finance/accounts`)
- Supports account types: `SAVINGS`, `CHECKING`, `CREDIT`, `INVESTMENT`, `CASH`.
- Supports currencies: `INR` (₹), `USD` ($), `EUR` (€), `GBP` (£).
- Total liquid net worth calculation across all accounts.
- Modal dialog for instant account creation without page refresh.

### 4. Transactions Ledger (`/finance/transactions`)
- **Multi-Field Filtering Drawer**: Filter by Account, Category, Type (`EXPENSE`, `INCOME`, `TRANSFER`), Date Range (`startDate`, `endDate`), and Amount.
- **Data Table**: Displays Date, Description, Category pill, Account pill, Type badge, and formatted Amount (+green for income, -red for expense).
- **Inline Row Actions**: Edit transaction modal, Delete transaction with browser confirmation and notification feedback.

### 5. Recurring Bills & Subscriptions (`/finance/recurring`)
- **Pending Occurrences Tab**: Lists upcoming bills due for payment. Offers 1-click **Confirm** (creates actual ledger transaction) and **Skip**.
- **Batch Generator**: Trigger tool with date picker (`throughDate`) calling `POST /finance/recurring-occurrences/generate`.
- **Recurring Templates Tab**: Configured schedules with frequencies (`DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `QUARTERLY`, `YEARLY`), active/paused indicators, pause/resume/deactivate controls.

---

## Authentication & Axios Interceptor Pattern

### Automatic Token Refresh Queue
When an API request receives a `401 Unauthorized`:
1. `apiClient.js` checks if a refresh token is present in storage.
2. If another refresh is already in-flight, it adds the request callback to `refreshSubscribers`.
3. Calls `POST /auth/refresh` to get a fresh `accessToken`.
4. Updates storage via `updateAccessToken(newAccessToken)`.
5. Replays all pending requests with the new Bearer token.
6. If refresh fails, it clears authentication and forces re-login.

### Correlation ID
Every outbound request automatically receives a unique `X-Request-ID` header:
```javascript
config.headers["X-Request-ID"] = crypto.randomUUID();
```
This enables end-to-end tracing matching the backend's `RequestContext` and `AuditLog`.

---

## Design System & Component Library

### 1. `Button` Component
```jsx
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";

<Button
    variant="primary"    // primary | secondary | danger | success | outline | ghost
    size="md"            // sm | md | lg
    icon={Plus}          // Optional Lucide icon
    loading={submitting} // Disables and displays animated spinner
    onClick={handleClick}
>
    Save Changes
</Button>
```

### 2. `Badge` Component
```jsx
import Badge from "../components/ui/Badge";

<Badge variant="success">INCOME</Badge>
<Badge variant="danger">EXPENSE</Badge>
<Badge variant="info">TRANSFER</Badge>
<Badge variant="warning">PENDING</Badge>
<Badge variant="purple">ADMIN</Badge>
```

### 3. `Modal` Component
```jsx
import Modal from "../components/ui/Modal";

<Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Create New Account"
    maxWidth="540px"
>
    <form>...</form>
</Modal>
```

### 4. `PageHeader` Component
```jsx
import PageHeader from "../components/ui/PageHeader";

<PageHeader
    title="Finance Hub"
    description="Track your monthly cash flows."
    action={<Button onClick={openAdd}>Add</Button>}
/>
```

### 5. `useNotification` Hook
```jsx
import { useNotification } from "../components/notifications/NotificationContext";

const notification = useNotification();
notification.success("Transaction recorded successfully!");
notification.error("Failed to load accounts.");
notification.info("Occurrence skipped.");
```

---

## Formatting Utilities (`src/utils/formatters.js`)

```javascript
formatCurrency(54000.5, "INR"); // "₹54,000.50"
formatDate("2026-10-30");        // "Oct 30, 2026"
formatDateTime("2026-10-30T12:00:00"); // "Oct 30, 2026, 12:00 PM"
```

---

## Adding a New Frontend Page / Module Checklist

1. **Service Layer**: Add REST functions to `src/services/<domain>Service.js` using `apiClient`.
2. **Page Component**: Create `src/pages/<domain>/<Domain>Page.jsx`.
   - Use `PageHeader` with descriptive title and action buttons.
   - Use `stats-grid` or `finance-hero-grid` for summary KPI cards.
   - Wrap interactive creation/edition in a `Modal`.
   - Wrap errors in `getApiError(err)` and toast with `useNotification()`.
3. **Route Registration**: Add `<Route path="/your-path" element={<YourPage />} />` inside `src/routes/AppRoutes.jsx`.
4. **Navigation**: Add `<NavLink>` with a Lucide icon inside `src/layouts/AppLayout.jsx`.
5. **Verify Build**: Run `npm run build` to confirm zero TypeScript/ESLint/Vite compile warnings or errors.
