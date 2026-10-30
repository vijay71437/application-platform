# Database Schema Reference

Database: **PostgreSQL**  
Migration tool: **Flyway**  
Migration files: `backend/src/main/resources/db/migration/`

---

## Entity Relationship Diagram

```
┌─────────────────────┐        ┌──────────────────────┐
│       users         │        │   refresh_tokens      │
├─────────────────────┤        ├──────────────────────┤
│ id (PK)             │◄───────│ user_id (FK)          │
│ username (UNIQUE)   │        │ token (UNIQUE)        │
│ email (UNIQUE)      │        │ expires_at            │
│ password            │        │ revoked               │
│ first_name          │        │ created_at            │
│ last_name           │        └──────────────────────┘
│ active              │
│ created_at          │        ┌──────────────────────┐
│ updated_at          │        │    audit_logs         │
└──────────┬──────────┘        ├──────────────────────┤
           │                   │ id (PK)               │
           │ user_roles        │ user_id (FK)          │
           │ (join)            │ action                │
           ▼                   │ resource_type         │
┌─────────────────────┐        │ resource_id           │
│        roles        │        │ details               │
├─────────────────────┤        │ ip_address            │
│ id (PK)             │        │ request_id            │
│ name (UNIQUE)       │        │ user_agent            │
│ description         │        │ created_at            │
└──────────┬──────────┘        └──────────────────────┘
           │
           │ role_permissions
           │ (join)
           ▼
┌─────────────────────┐
│     permissions     │
├─────────────────────┤
│ id (PK)             │
│ name (UNIQUE)       │
│ description         │
└─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   FINANCE DOMAIN                         │
└─────────────────────────────────────────────────────────┘

users ──────────────────────────────────────────────────
  │                                                    │
  ▼                                                    ▼
finance_accounts                            finance_categories
  │                                                    │
  └────────────────────┬───────────────────────────────┘
                       │
                       ▼
              financial_transactions ◄─── recurring_transaction_occurrences
                                                       │
                                          recurring_transactions
                                            (account_id, category_id)
```

---

## Table: users (V1)

```sql
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,        -- BCrypt encoded
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP
);
```

**JPA Entity:** `com.vijay.platform.user.entity.User`

---

## Table: roles (V2)

```sql
CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);
```

**Default values (V6):** `ADMIN`, `USER`

**JPA Entity:** `com.vijay.platform.authorization.entity.Role`

---

## Table: permissions (V3)

```sql
CREATE TABLE permissions (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);
```

**Default values (V7):** USER_READ, USER_UPDATE, USER_DELETE, ROLE_READ, ROLE_CREATE, ROLE_UPDATE, ROLE_DELETE, PERMISSION_READ, PERMISSION_CREATE, PERMISSION_UPDATE, PERMISSION_DELETE

**JPA Entity:** `com.vijay.platform.authorization.entity.Permission`

---

## Table: user_roles (V4)

```sql
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

**JPA mapping:** `@ManyToMany` between `User` and `Role`

---

## Table: role_permissions (V5)

```sql
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL REFERENCES roles(id),
    permission_id BIGINT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

**JPA mapping:** `@ManyToMany` between `Role` and `Permission`

---

## Table: refresh_tokens (V9)

```sql
CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    token       TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);
```

**JPA Entity:** `com.vijay.platform.security.entity.RefreshToken`

---

## Table: audit_logs (V10 + V11)

```sql
CREATE TABLE audit_logs (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT REFERENCES users(id),
    action        VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id   VARCHAR(100),
    details       TEXT,
    created_at    TIMESTAMP NOT NULL,
    -- Added in V11:
    ip_address    VARCHAR(45),
    request_id    VARCHAR(100),
    user_agent    TEXT
);
```

**JPA Entity:** `com.vijay.platform.audit.entity.AuditLog`

---

## Table: finance_accounts (V12)

```sql
CREATE TABLE finance_accounts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,   -- FinanceAccountType enum
    balance     NUMERIC(19, 2) NOT NULL DEFAULT 0,
    currency    VARCHAR(10) NOT NULL DEFAULT 'INR',
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);
```

**JPA Entity:** `com.vijay.platform.finance.account.entity.FinanceAccount`  
**Enum:** `FinanceAccountType`

---

## Table: finance_categories (V13)

```sql
CREATE TABLE finance_categories (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(20) NOT NULL,   -- INCOME | EXPENSE
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_id, name)
);
```

**JPA Entity:** `com.vijay.platform.finance.category.entity.FinanceCategory`

---

## Table: financial_transactions (V14)

```sql
CREATE TABLE financial_transactions (
    id               BIGSERIAL PRIMARY KEY,
    account_id       BIGINT REFERENCES finance_accounts(id),
    category_id      BIGINT REFERENCES finance_categories(id),
    type             VARCHAR(20) NOT NULL,      -- INCOME | EXPENSE | TRANSFER
    amount           NUMERIC(19, 2) NOT NULL,
    description      VARCHAR(500) NOT NULL,
    notes            TEXT,
    transaction_date DATE NOT NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP
);
```

**JPA Entity:** `com.vijay.platform.finance.transaction.entity.FinanceTransaction`

---

## Table: recurring_transactions (V15)

```sql
CREATE TABLE recurring_transactions (
    id          BIGSERIAL PRIMARY KEY,
    account_id  BIGINT REFERENCES finance_accounts(id),
    category_id BIGINT REFERENCES finance_categories(id),
    type        VARCHAR(20) NOT NULL,
    amount      NUMERIC(19, 2) NOT NULL,
    description VARCHAR(500) NOT NULL,
    frequency   VARCHAR(20) NOT NULL,  -- RecurringFrequency enum
    start_date  DATE NOT NULL,
    end_date    DATE,
    active      BOOLEAN NOT NULL DEFAULT true,
    paused      BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP
);
```

**JPA Entity:** `com.vijay.platform.finance.recurring.entity.RecurringTransaction`  
**Enums:** `RecurringFrequency`, `FinanceTransactionType`

---

## Table: recurring_transaction_occurrences (V16)

```sql
CREATE TABLE recurring_transaction_occurrences (
    id                        BIGSERIAL PRIMARY KEY,
    recurring_transaction_id  BIGINT NOT NULL REFERENCES recurring_transactions(id),
    scheduled_date            DATE NOT NULL,
    actual_date               DATE,
    status                    VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_id            BIGINT REFERENCES financial_transactions(id),
    created_at                TIMESTAMP NOT NULL DEFAULT now()
);
```

**JPA Entity:** `com.vijay.platform.finance.recurring.entity.RecurringTransactionOccurrence`  
**Enum:** `RecurringOccurrenceStatus` — `PENDING`, `CONFIRMED`, `SKIPPED`

---

## Key Indexes (implied by constraints)

- `users.username` — UNIQUE index
- `users.email` — UNIQUE index
- `refresh_tokens.token` — UNIQUE index
- `finance_categories(user_id, name)` — UNIQUE composite index
- All FK columns — implicitly indexed by PostgreSQL

---

## Notes

- All tables use `BIGSERIAL` (auto-increment BIGINT) for PKs
- Timestamps use `TIMESTAMP` (without timezone) — stored as UTC
- Financial amounts use `NUMERIC(19, 2)` for precision (no floating point)
- Currency stored as VARCHAR(10) string codes (e.g., "INR", "USD")
- `active` flag pattern used for soft-deletes on `users` and `recurring_transactions`
