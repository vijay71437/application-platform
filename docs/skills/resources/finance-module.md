# Finance Module

## Overview

The Finance module provides personal finance management features scoped **per authenticated user**. It consists of four sub-domains:

1. **Accounts** — where money is held
2. **Categories** — classify income/expenses
3. **Transactions** — individual financial events
4. **Recurring Transactions** — templates for repeating transactions + occurrence tracking

---

## Domain Model

```
User
 ├── FinanceAccount (1..n)
 │     └── FinanceAccountType: SAVINGS | CHECKING | CREDIT | INVESTMENT | CASH | ...
 │
 ├── FinanceCategory (1..n)
 │     └── FinanceCategoryType: INCOME | EXPENSE
 │
 ├── FinanceTransaction (1..n)
 │     ├── → FinanceAccount (account)
 │     ├── → FinanceCategory (category)
 │     ├── FinanceTransactionType: INCOME | EXPENSE | TRANSFER
 │     ├── amount: BigDecimal
 │     ├── transactionDate: LocalDate
 │     ├── description: String
 │     └── notes: String (optional)
 │
 └── RecurringTransaction (1..n)
       ├── → FinanceAccount
       ├── → FinanceCategory
       ├── RecurringFrequency: DAILY|WEEKLY|BIWEEKLY|MONTHLY|QUARTERLY|YEARLY
       ├── startDate: LocalDate
       ├── endDate: LocalDate (nullable)
       ├── active: boolean
       ├── paused: boolean
       └── RecurringTransactionOccurrence (1..n)
             └── RecurringOccurrenceStatus: PENDING | CONFIRMED | SKIPPED
```

---

## Sub-module: Accounts

**Controller:** `FinanceAccountController`  
**Service:** `FinanceAccountService`  
**Entity:** `FinanceAccount`  
**Repository:** `FinanceAccountRepository`

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/finance/accounts` | Create account |
| GET | `/api/v1/finance/accounts` | Get user's accounts |

### FinanceAccount Fields
```java
Long id
User user             // owner
String name           // account name
FinanceAccountType type
BigDecimal balance    // current balance
String currency       // e.g., "INR", "USD"
String description
LocalDateTime createdAt
```

### FinanceAccountResponse DTO
```json
{
  "id": 1,
  "name": "Main Savings",
  "type": "SAVINGS",
  "balance": 5000.00,
  "currency": "INR",
  "description": "...",
  "createdAt": "2026-10-30T12:00:00"
}
```

---

## Sub-module: Categories

**Controller:** `FinanceCategoryController`  
**Service:** `FinanceCategoryService`  
**Entity:** `FinanceCategory`  
**Repository:** `FinanceCategoryRepository`

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/finance/categories` | Create category |
| GET | `/api/v1/finance/categories` | Get user's categories |

### Duplicate Protection
`DuplicateFinanceCategoryException` thrown when creating a category with the same name for the same user.

---

## Sub-module: Transactions

**Controller:** `FinanceTransactionController`  
**Service:** `FinanceTransactionService`  
**Entity:** `FinanceTransaction`  
**Repository:** `FinanceTransactionRepository` (with JPA Specification)  
**Specification:** `FinanceTransactionSpecification`

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/finance/transactions` | Create transaction |
| GET | `/api/v1/finance/transactions` | Get all transactions |
| GET | `/api/v1/finance/transactions/{id}` | Get by ID |
| GET | `/api/v1/finance/transactions/search` | Filter transactions |
| PUT | `/api/v1/finance/transactions/{id}` | Update transaction |
| DELETE | `/api/v1/finance/transactions/{id}` | Delete transaction |
| GET | `/api/v1/finance/transactions/page` | Paginated list |
| GET | `/api/v1/finance/transactions/summary/monthly` | Monthly summary |
| GET | `/api/v1/finance/transactions/summary/categories` | Category breakdown |

### JPA Projections
- **`FinanceMonthlySummaryProjection`** — used for monthly income/expense aggregation
- **`FinanceCategoryExpenseProjection`** — used for category expense breakdown

### Exceptions
| Exception | HTTP | Scenario |
|-----------|------|----------|
| `FinanceTransactionNotFoundException` | 404 | Transaction ID not found |
| `FinanceResourceNotFoundException` | 404 | Related resource (account/category) not found |
| `FinanceResourceAccessException` | 403 | User doesn't own the resource |
| `FinanceTransactionValidationException` | 400 | Invalid transaction data |

---

## Sub-module: Recurring Transactions

**Controllers:** `RecurringTransactionController`, `RecurringOccurrenceController`  
**Services:** `RecurringTransactionService`, `RecurringOccurrenceService`, `RecurringDateCalculator`  
**Entities:** `RecurringTransaction`, `RecurringTransactionOccurrence`  
**Repositories:** `RecurringTransactionRepository`, `RecurringTransactionOccurrenceRepository`  
**Projection:** `RecurringOccurrenceSummaryProjection`

### Lifecycle

```
Create RecurringTransaction (template)
        │
        ▼
POST /recurring-occurrences/generate?throughDate=2026-12-31
        │ RecurringDateCalculator computes next dates
        │ Creates RecurringTransactionOccurrence records (status=PENDING)
        ▼
GET /recurring-occurrences/pending
        │ User reviews upcoming occurrences
        ▼
POST /recurring-occurrences/{id}/confirm
        │ Creates actual FinanceTransaction
        │ Marks occurrence as CONFIRMED
        └── OR PATCH /{id}/skip → status=SKIPPED
```

### Recurring Frequencies
| Enum | Period |
|------|--------|
| `DAILY` | Every day |
| `WEEKLY` | Every 7 days |
| `BIWEEKLY` | Every 14 days |
| `MONTHLY` | Same day each month |
| `QUARTERLY` | Every 3 months |
| `YEARLY` | Same day each year |

### RecurringTransactionOccurrence Fields
```java
Long id
RecurringTransaction recurringTransaction
LocalDate scheduledDate     // when it should occur
LocalDate actualDate        // when it was confirmed
RecurringOccurrenceStatus status  // PENDING | CONFIRMED | SKIPPED
FinanceTransaction transaction    // linked if confirmed
```

### Pause/Resume
- `PATCH /recurring-transactions/{id}/pause` → sets `paused = true`
- `PATCH /recurring-transactions/{id}/resume` → sets `paused = false`
- Paused transactions are excluded from occurrence generation

### Deactivate
- `DELETE /recurring-transactions/{id}` → sets `active = false`
- Deactivated templates don't generate new occurrences

---

## Database Tables

### finance_accounts (V12)
```sql
id          BIGSERIAL PRIMARY KEY
user_id     BIGINT NOT NULL REFERENCES users(id)
name        VARCHAR NOT NULL
type        VARCHAR NOT NULL  -- FinanceAccountType enum
balance     NUMERIC(19,2) NOT NULL DEFAULT 0
currency    VARCHAR(10) NOT NULL DEFAULT 'INR'
description TEXT
created_at  TIMESTAMP NOT NULL DEFAULT now()
```

### finance_categories (V13)
```sql
id          BIGSERIAL PRIMARY KEY
user_id     BIGINT NOT NULL REFERENCES users(id)
name        VARCHAR NOT NULL
type        VARCHAR NOT NULL  -- INCOME | EXPENSE
description TEXT
created_at  TIMESTAMP NOT NULL DEFAULT now()
UNIQUE(user_id, name)
```

### financial_transactions (V14)
```sql
id               BIGSERIAL PRIMARY KEY
account_id       BIGINT REFERENCES finance_accounts(id)
category_id      BIGINT REFERENCES finance_categories(id)
type             VARCHAR NOT NULL  -- INCOME | EXPENSE | TRANSFER
amount           NUMERIC(19,2) NOT NULL
description      VARCHAR NOT NULL
notes            TEXT
transaction_date DATE NOT NULL
created_at       TIMESTAMP NOT NULL DEFAULT now()
updated_at       TIMESTAMP
```

### recurring_transactions (V15)
```sql
id           BIGSERIAL PRIMARY KEY
account_id   BIGINT REFERENCES finance_accounts(id)
category_id  BIGINT REFERENCES finance_categories(id)
type         VARCHAR NOT NULL
amount       NUMERIC(19,2) NOT NULL
description  VARCHAR NOT NULL
frequency    VARCHAR NOT NULL  -- RecurringFrequency enum
start_date   DATE NOT NULL
end_date     DATE
active       BOOLEAN NOT NULL DEFAULT true
paused       BOOLEAN NOT NULL DEFAULT false
created_at   TIMESTAMP NOT NULL DEFAULT now()
updated_at   TIMESTAMP
```

### recurring_transaction_occurrences (V16)
```sql
id                      BIGSERIAL PRIMARY KEY
recurring_transaction_id BIGINT REFERENCES recurring_transactions(id)
scheduled_date          DATE NOT NULL
actual_date             DATE
status                  VARCHAR NOT NULL  -- PENDING | CONFIRMED | SKIPPED
transaction_id          BIGINT REFERENCES financial_transactions(id)
created_at              TIMESTAMP NOT NULL DEFAULT now()
```
