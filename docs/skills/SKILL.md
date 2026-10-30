---
name: application-platform-backend
description: >
  Comprehensive skill for the Application Platform Spring Boot backend.
  Use this skill when working with or extending the backend codebase at
  /Users/vijaykumarmali/Documents/projects/application-platform/backend.
  Covers architecture, all REST endpoints, security, database schema,
  finance module, patterns, and coding conventions.
---

# Application Platform — Backend Skill

## Overview

A **Spring Boot 4.1.1 / Java 21** stateless REST API with:
- JWT + Refresh Token authentication
- Role-Based Access Control (RBAC) with fine-grained permissions
- Finance module (accounts, categories, transactions, recurring)
- Audit logging with full request context
- PostgreSQL + Flyway migrations
- OpenAPI / Swagger UI

---

## Project Location

```
/Users/vijaykumarmali/Documents/projects/application-platform/backend/
```

- **Entry point:** `com.vijay.platform.ApplicationPlatformApplication`
- **API base:** `/api/v1`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **API Docs:** `http://localhost:8080/v3/api-docs`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 4.1.1 |
| Language | Java 21 |
| ORM | Spring Data JPA + Hibernate |
| Database | PostgreSQL |
| Migrations | Flyway (16 migrations) |
| Security | Spring Security + JWT (jjwt 0.12.6) |
| Build | Maven |
| Code generation | Lombok |
| Validation | Jakarta Bean Validation |
| API Docs | SpringDoc OpenAPI 2.8.13 |
| JSON | Jackson + jsr310 |
| Env vars | spring-dotenv |

---

## Module Architecture

```
com.vijay.platform/
├── common/              # Shared infrastructure (filters, response wrappers, exceptions)
├── audit/               # Audit log entity, service, repository
├── authentication/      # /api/v1/auth — login, register, refresh, logout, change-password
├── authorization/       # /api/v1/roles + /api/v1/permissions — RBAC management
├── user/                # /api/v1/users — CRUD + role assignment
├── security/            # JWT filter, refresh tokens, Spring Security config
└── finance/
    ├── account/         # /api/v1/finance/accounts
    ├── category/        # /api/v1/finance/categories
    ├── transaction/     # /api/v1/finance/transactions
    └── recurring/       # /api/v1/finance/recurring-transactions + occurrences
```

Full details in `resources/` subdirectory files.

---

## Key Coding Conventions

### 1. Standard Response Wrapper
Every endpoint returns `ApiResponse<T>`:
```java
return ApiResponse.success("Message", data);
return ApiResponse.error("Message", "ERROR_CODE", null);
```
Payload fields: `success`, `message`, `data`, `errorCode`, `timestamp`, `requestId`

### 2. Pagination
```java
PaginationRequest pagination = new PaginationRequest(page, size, sortBy, sortDirection);
// Returns PageResponse<T> with: content, page, size, totalElements, totalPages, first, last
```
Defaults: `page=0, size=20, sortBy=createdAt, sortDirection=desc`

### 3. Exception Hierarchy
```
RuntimeException
  └── BusinessException(message, errorCode)
        ├── InvalidResourceException
        ├── InvalidParameterException
        ├── InvalidResourceReferenceException
        └── [domain-specific] UserNotFoundException, RoleAlreadyExistsException, etc.
```
`GlobalExceptionHandler` maps all exceptions → HTTP responses.

### 4. Security Guards
```java
@PreAuthorize("hasAuthority('USER_READ')")     // Permission-based
@PreAuthorize("hasRole('ADMIN')")               // Role-based
@PreAuthorize("isAuthenticated()")              // Just needs JWT
```

### 5. Audit Logging Pattern
```java
auditService.log(
    user,
    AuditAction.USER_CREATED,  // constant from AuditAction class
    "USER",                     // resource type
    user.getId().toString(),    // resource id
    "Description of action"    // details
);
```

### 6. Entity Pattern
```java
@Entity
@Table(name = "table_name")
@Getter @Setter
public class MyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

### 7. Adding a New Module
1. Create package under `com.vijay.platform.<module>`
2. Sub-packages: `controller/`, `dto/`, `entity/`, `repository/`, `service/`, `exception/`
3. Controller mapping: `@RequestMapping(ApiConstants.API_V1 + "/your-path")`
4. Add `@SecurityRequirement(name = "bearerAuth")` to controller
5. Add Flyway migration `V{n}__create_<table>.sql`
6. Register exception in `GlobalExceptionHandler`

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | HTTP port |
| `DB_URL` | `jdbc:postgresql://localhost:5433/application_platform` | JDBC URL |
| `DB_USERNAME` | `platform_user` | DB username |
| `DB_PASSWORD` | `platform_password` | DB password |
| `JWT_SECRET` | (weak default, change in production!) | JWT HMAC signing key |
| `JWT_ACCESS_TOKEN_EXPIRATION` | `900000` | Access token TTL in milliseconds (15 min) |

---

## Database Migrations (Flyway)

| Migration | Table/Action |
|-----------|-------------|
| V1 | `users` |
| V2 | `roles` |
| V3 | `permissions` |
| V4 | `user_roles` (join table) |
| V5 | `role_permissions` (join table) |
| V6 | Seed default roles: ADMIN, USER |
| V7 | Seed default permissions |
| V8 | Assign all permissions to ADMIN role |
| V9 | `refresh_tokens` |
| V10 | `audit_logs` |
| V11 | Add `request_id`, `ip_address`, `user_agent` to audit_logs |
| V12 | `finance_accounts` |
| V13 | `finance_categories` |
| V14 | `financial_transactions` |
| V15 | `recurring_transactions` |
| V16 | `recurring_transaction_occurrences` |

---

## Resource Files

| File | Contents |
|------|----------|
| `resources/endpoints.md` | All REST endpoints with method, path, auth, body, response |
| `resources/finance-module.md` | Finance domain: accounts, categories, transactions, recurring |
| `resources/security-architecture.md` | JWT flow, refresh tokens, RBAC, Spring Security config |
| `resources/common-patterns.md` | Reusable patterns, snippets, GlobalExceptionHandler map |
| `resources/database-schema.md` | Full database entity/relationship documentation |
