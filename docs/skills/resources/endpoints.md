# REST Endpoints Reference

**API Base:** `/api/v1`  
**Auth:** All protected endpoints require `Authorization: Bearer <access_token>`

---

## Authentication — `/api/v1/auth`

> Public endpoints — no token required.

### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "Secret123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### POST /api/v1/auth/login
Authenticate and receive access + refresh tokens.

**Request Body:**
```json
{
  "username": "john",
  "password": "Secret123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJ...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "userId": 1,
    "username": "john",
    "roles": ["USER"],
    "permissions": ["USER_READ"],
    "refreshToken": "uuid-refresh-token"
  }
}
```

---

### POST /api/v1/auth/refresh
Exchange a valid refresh token for a new access token.

**Request Body:**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response:** `200 OK` — same shape as login response.

---

### POST /api/v1/auth/logout
Revoke a refresh token.

**Request Body:**
```json
{
  "refreshToken": "uuid-refresh-token"
}
```

**Response:** `200 OK`
```json
{ "success": true, "message": "Logout successful", "data": null }
```

---

### POST /api/v1/auth/change-password
Change the authenticated user's password. Revokes all existing refresh tokens.

**Auth:** Required (Bearer token)

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{ "success": true, "message": "Password changed successfully", "data": null }
```

---

## Users — `/api/v1/users`

> All endpoints require Bearer token. Permission/role guards specified per endpoint.

### GET /api/v1/users
List all users with pagination and search.

**Auth:** `USER_READ` permission  
**Query Params:**
- `page` (default: 0)
- `size` (default: 20)
- `sortBy` (default: `createdAt`)
- `sortDirection` (default: `desc`)
- `search` (optional, searches username/email/name)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [{ "id": 1, "username": "john", ... }],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  }
}
```

---

### GET /api/v1/users/{id}
Get a single user by ID.

**Auth:** `USER_READ` permission

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": { "id": 1, "username": "john", "email": "john@example.com", ... }
}
```

---

### PUT /api/v1/users/{id}
Update user details.

**Auth:** `USER_UPDATE` permission

**Request Body:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "email": "johnny@example.com"
}
```

**Response:** `200 OK` — updated `UserResponse`

---

### DELETE /api/v1/users/{id}
Deactivate (soft delete) a user.

**Auth:** `USER_DELETE` permission

**Response:** `200 OK`
```json
{ "success": true, "message": "User deactivated successfully", "data": { ... } }
```

---

### PUT /api/v1/users/{id}/roles
Assign roles to a user (replaces existing roles).

**Auth:** `ADMIN` role

**Request Body:**
```json
{
  "roleIds": [1, 2]
}
```

**Response:** `200 OK` — updated `UserResponse`

---

## Roles — `/api/v1/roles`

> All endpoints require `ADMIN` role.

### GET /api/v1/roles
Get all roles.

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "ADMIN", "description": "...", "permissions": [...] }
  ]
}
```

### GET /api/v1/roles/{id}
Get role by ID.

### POST /api/v1/roles
Create a new role.

**Request Body:**
```json
{
  "name": "MANAGER",
  "description": "Manager role"
}
```

### PUT /api/v1/roles/{id}
Update a role's name/description.

**Request Body:**
```json
{
  "name": "SENIOR_MANAGER",
  "description": "Updated description"
}
```

### DELETE /api/v1/roles/{id}
Delete a role (fails with 409 if role is in use by any user).

### PUT /api/v1/roles/{id}/permissions
Assign permissions to a role (replaces existing permissions).

**Request Body:**
```json
{
  "permissionIds": [1, 2, 3]
}
```

---

## Permissions — `/api/v1/permissions`

> All endpoints require `ADMIN` role.

### GET /api/v1/permissions
Get all permissions.

### GET /api/v1/permissions/{id}
Get permission by ID.

### POST /api/v1/permissions
Create a new permission.

**Request Body:**
```json
{
  "name": "REPORT_READ",
  "description": "Can read reports"
}
```

### PUT /api/v1/permissions/{id}
Update a permission.

### DELETE /api/v1/permissions/{id}
Delete a permission (fails with 409 if in use by a role).

---

## Finance Accounts — `/api/v1/finance/accounts`

> All endpoints require authentication (`isAuthenticated()`).  
> Accounts are per-user (scoped to the authenticated user's username).

### POST /api/v1/finance/accounts
Create a finance account.

**Request Body:**
```json
{
  "name": "Main Savings",
  "type": "SAVINGS",
  "balance": 5000.00,
  "currency": "INR",
  "description": "Primary savings account"
}
```

**Response:** `201 Created`

Account types (`FinanceAccountType`): `SAVINGS`, `CHECKING`, `CREDIT`, `INVESTMENT`, `CASH`, etc.

### GET /api/v1/finance/accounts
Get all accounts belonging to the authenticated user.

---

## Finance Categories — `/api/v1/finance/categories`

> All endpoints require authentication. Categories are per-user.

### POST /api/v1/finance/categories
Create a finance category.

**Request Body:**
```json
{
  "name": "Groceries",
  "type": "EXPENSE",
  "description": "Food and grocery expenses"
}
```

Category types (`FinanceCategoryType`): `INCOME`, `EXPENSE`

### GET /api/v1/finance/categories
Get all categories for the authenticated user.

---

## Finance Transactions — `/api/v1/finance/transactions`

> All endpoints require authentication.

### POST /api/v1/finance/transactions
Create a transaction.

**Request Body:**
```json
{
  "accountId": 1,
  "categoryId": 2,
  "transactionType": "EXPENSE",
  "amount": 250.00,
  "description": "Weekly groceries",
  "transactionDate": "2026-10-30"
}
```

Transaction types (`FinanceTransactionType`): `INCOME`, `EXPENSE`, `TRANSFER`

**Response:** `201 Created`

### GET /api/v1/finance/transactions
Get all transactions (no pagination).

### GET /api/v1/finance/transactions/{id}
Get a transaction by ID.

### GET /api/v1/finance/transactions/search
Filter transactions with query params.

**Query Params** (`FinanceTransactionFilterRequest`):
- `accountId` — filter by account ID
- `categoryId` — filter by category ID
- `transactionType` — INCOME | EXPENSE | TRANSFER
- `startDate` — ISO date (yyyy-MM-dd)
- `endDate` — ISO date

### PUT /api/v1/finance/transactions/{id}
Update a transaction.

**Request Body:** Same fields as create (`accountId`, `categoryId`, `transactionType`, `amount`, `transactionDate`, `description`).

### DELETE /api/v1/finance/transactions/{id}
Delete a transaction.

### GET /api/v1/finance/transactions/summary/monthly
Monthly income/expense summary.

**Query Params:**
- `year` — e.g., `2026`
- `month` — 1–12

**Response:**
```json
{
  "data": {
    "year": 2026,
    "month": 10,
    "totalIncome": 50000.00,
    "totalExpense": 15000.00,
    "netBalance": 35000.00
  }
}
```

### GET /api/v1/finance/transactions/summary/categories
Expense breakdown by category for a date range.

**Query Params:**
- `startDate` — ISO date
- `endDate` — ISO date

**Response:**
```json
{
  "data": [
    { "categoryId": 1, "categoryName": "Groceries", "totalAmount": 4500.00, "percentage": 30.0 }
  ]
}
```

### GET /api/v1/finance/transactions/page
Paginated transactions list.

**Query Params:**
- `page` (default: 0)
- `size` (default: 20)
- `sortBy` (default: `transactionDate`)
- `direction` (default: `DESC`)

---

## Recurring Transactions — `/api/v1/finance/recurring-transactions`

> All endpoints require authentication.

### POST /api/v1/finance/recurring-transactions
Create a recurring transaction template.

**Request Body:**
```json
{
  "accountId": 1,
  "categoryId": 2,
  "transactionType": "EXPENSE",
  "amount": 999.00,
  "description": "Netflix subscription",
  "frequency": "MONTHLY",
  "startDate": "2026-11-01",
  "endDate": null
}
```

Frequencies (`RecurringFrequency`): `DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `QUARTERLY`, `YEARLY`

**Response:** `201 Created`

### GET /api/v1/finance/recurring-transactions
Get all recurring transactions.

### GET /api/v1/finance/recurring-transactions/active
Get only active (not paused/deactivated) recurring transactions.

### PUT /api/v1/finance/recurring-transactions/{id}
Update a recurring transaction template.

### PATCH /api/v1/finance/recurring-transactions/{id}/pause
Pause a recurring transaction.

### PATCH /api/v1/finance/recurring-transactions/{id}/resume
Resume a paused recurring transaction.

### DELETE /api/v1/finance/recurring-transactions/{id}
Deactivate a recurring transaction (soft delete).

---

## Recurring Occurrences — `/api/v1/finance/recurring-occurrences`

> All endpoints require authentication.

### POST /api/v1/finance/recurring-occurrences/generate
Generate occurrence records for all active recurring transactions up to a date.

**Query Params:**
- `throughDate` — ISO date (required)

**Response:**
```json
{ "data": 5 }  // number of occurrences generated
```

### GET /api/v1/finance/recurring-occurrences/pending
Get all pending (unconfirmed) occurrences.

### POST /api/v1/finance/recurring-occurrences/{id}/confirm
Confirm an occurrence (creates the actual transaction).

### PATCH /api/v1/finance/recurring-occurrences/{id}/skip
Skip an occurrence.

### GET /api/v1/finance/recurring-occurrences/history
Get occurrence history for a date range.

**Query Params:**
- `startDate` — ISO date
- `endDate` — ISO date

### GET /api/v1/finance/recurring-occurrences/summary
Get summary of occurrences for a date range.

**Query Params:**
- `startDate` — ISO date
- `endDate` — ISO date

**Response:** `RecurringOccurrenceSummaryResponse`

---

## Health & Utility

### GET /api/health
Public health check endpoint.

**Response:** `200 OK`
```json
{ "status": "UP" }
```

### GET /actuator/health
Spring Boot Actuator health (details: never in response).

### GET /actuator/info
App info: name, description, version 1.0.0.

### GET /actuator/metrics
Available metrics.

---

## Common Error Responses

All errors follow `ApiResponse<Void>` with `success: false`:

| HTTP Status | errorCode | Scenario |
|-------------|-----------|----------|
| 400 | `COMMON_VALIDATION_ERROR` | Bean validation failure |
| 400 | `COMMON_INVALID_REQUEST_BODY` | Malformed JSON |
| 400 | `COMMON_MISSING_PARAMETER` | Missing required query param |
| 400 | `COMMON_INVALID_PARAMETER` | Type mismatch in param |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 403 | `ACCESS_DENIED` | Insufficient permissions |
| 404 | `RESOURCE_NOT_FOUND` | Entity not found |
| 409 | `CONFLICT` | Duplicate resource or resource in use |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |
