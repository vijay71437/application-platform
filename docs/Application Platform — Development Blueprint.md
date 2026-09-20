# Application Platform

## 1. Project Objective

Application Platform is a reusable application foundation designed to provide common enterprise capabilities so that future applications can focus primarily on business logic.

The platform should provide reusable:

- Authentication
- Authorization
- User management
- Role and permission management
- JWT security
- Refresh-token/session management
- API response standards
- Exception handling
- Request tracing
- Audit logging
- Database migrations
- API documentation
- Environment configuration
- Docker-based infrastructure

The platform is designed as a **modular monolith** initially.

---

# 2. Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- JJWT
- Lombok
- Springdoc OpenAPI / Swagger

## Frontend

- React
- JavaScript/TypeScript
- React Router
- API client
- Authentication state management

## Infrastructure

- Docker
- Docker Compose
- PostgreSQL Docker container

## Development

- Git
- GitHub
- Maven
- REST APIs
- OpenAPI

---

# 3. Repository Structure

Current repository:

```text
application-platform/
│
├── backend/
│
├── frontend/
│
├── database/
│
├── docker/
│
├── docs/
│
├── .gitignore
├── .env.example
├── docker-compose.yml
├── README.md
└── ...
```

Backend architecture:

```text
com.vijay.platform
│
├── common/
│   ├── exception/
│   ├── response/
│   ├── validation/
│   ├── util/
│   ├── controller/
│   ├── context/
│   ├── filter/
│   └── config/
│
├── security/
│   ├── config/
│   ├── jwt/
│   ├── handler/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── authentication/
│   ├── controller/
│   ├── service/
│   ├── dto/
│   └── exception/
│
├── authorization/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── user/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   ├── service/
│   └── exception/
│
└── audit/
    ├── entity/
    ├── repository/
    └── service/
```

Business modules will later be added independently.

Example:

```text
features/
├── project/
├── employee/
├── invoice/
└── notification/
```

Platform modules must not depend on business modules.

---

# 4. Completed Development

## Step 1 — Repository Setup

Completed:

- Git repository created
- GitHub repository created
- Repository cloned locally
- Initial project structure created
- `.gitignore` configured
- README created

Development branch:

```text
feature/backend-foundation
```

---

# 5. Spring Boot Backend

Completed:

- Spring Boot backend created
- Java 21 configured
- Maven configured
- Base package:

```text
com.vijay.platform
```

Health endpoint:

```http
GET /api/health
```

Response:

```text
Application Platform is running
```

Backend runs on:

```text
http://localhost:8080
```

---

# 6. PostgreSQL Development Environment

PostgreSQL is running through Docker.

Container:

```text
application-platform-postgres
```

Database:

```text
application_platform
```

Development configuration is provided through `.env`.

Docker Compose provides:

- PostgreSQL
- Persistent volume
- Health check
- Restart policy
- Environment-based configuration

---

# 7. Database Migration System

Flyway has been added.

Hibernate is configured to validate the database:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

Flyway owns schema creation and modification.

Current migrations:

```text
V1__create_users.sql
V2__create_roles.sql
V3__create_permissions.sql
V4__create_user_roles.sql
V5__create_role_permissions.sql
V6__insert_default_roles.sql
V7__insert_default_permissions.sql
V8__create_refresh_tokens.sql
V9__create_audit_logs.sql
V10__add_request_context_to_audit_logs.sql
```

---

# 8. User Database Model

Users table contains:

```text
id
username
email
password
first_name
last_name
enabled
account_locked
created_at
updated_at
```

Constraints:

- Username unique
- Email unique
- Password stored as a BCrypt hash
- Enabled flag supports account deactivation
- Account locked flag supports security controls

---

# 9. Authorization Database Model

Created:

```text
roles
permissions
user_roles
role_permissions
```

Default roles:

```text
ROLE_USER
ROLE_ADMIN
```

Default permissions:

```text
USER_READ
USER_CREATE
USER_UPDATE
USER_DELETE
```

Relationship:

```text
User
 │
 └── User Roles
        │
        ↓
      Role
        │
        └── Role Permissions
                │
                ↓
            Permission
```

---

# 10. JPA Entities

Completed entities:

```text
User
Role
Permission
RefreshToken
AuditLog
```

Repositories:

```text
UserRepository
RoleRepository
PermissionRepository
RefreshTokenRepository
AuditLogRepository
```

JPA auditing is enabled for entity timestamps.

---

# 11. Entity Equality Fix

A JPA/Lombok equality issue was identified and fixed.

`User.username` is used as the natural identity for equality.

`Role.name` is used as the natural identity for equality.

This prevents different roles from being treated as equal when stored in a `HashSet`.

This is particularly important for:

```text
ROLE_USER
ROLE_ADMIN
```

---

# 12. Standard API Response

All normal APIs use:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "errorCode": null,
  "timestamp": "...",
  "requestId": "..."
}
```

Error:

```json
{
  "success": false,
  "message": "...",
  "data": null,
  "errorCode": "...",
  "timestamp": "...",
  "requestId": "..."
}
```

The response contract is centralized in:

```text
common/response/ApiResponse.java
```

---

# 13. Global Exception Handling

Centralized exception handling has been implemented.

Handled categories include:

### Validation

```text
COMMON_VALIDATION_FAILED
```

### Internal errors

```text
COMMON_INTERNAL_SERVER_ERROR
```

### User errors

```text
USER_NOT_FOUND
USER_USERNAME_ALREADY_EXISTS
USER_EMAIL_ALREADY_EXISTS
```

### Authentication errors

```text
AUTH_INVALID_CREDENTIALS
AUTH_INVALID_CURRENT_PASSWORD
AUTH_INVALID_REFRESH_TOKEN
AUTH_AUTHENTICATION_REQUIRED
AUTH_ACCESS_DENIED
```

### Invalid request

```text
COMMON_INVALID_REQUEST_BODY
COMMON_MISSING_PARAMETER
COMMON_INVALID_PARAMETER
```

HTTP statuses are mapped appropriately:

```text
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
500 → Internal Server Error
```

---

# 14. User Registration

Endpoint:

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "vijay",
  "email": "vijay@example.com",
  "password": "password123",
  "firstName": "Vijay",
  "lastName": "Mali"
}
```

Features:

- Request validation
- Duplicate username detection
- Duplicate email detection
- BCrypt password hashing
- Default `ROLE_USER`
- Standard API response

User creation logic has been extracted into:

```text
UserCreationService
```

This prevents duplicate user-creation logic between registration and administrator-created users.

---

# 15. JWT Authentication

JWT authentication has been implemented.

Login:

```http
POST /api/auth/login
```

JWT contains the authenticated user's identity.

Access-token expiration:

```text
15 minutes
```

JWT processing is handled by:

```text
JwtService
JwtAuthenticationFilter
CustomUserDetailsService
```

JWT is sent through:

```http
Authorization: Bearer <access-token>
```

---

# 16. Spring Security

Security is configured as:

```text
Stateless authentication
JWT-based authentication
CSRF disabled for REST API
Method-level authorization enabled
```

Method security supports:

```java
@PreAuthorize("hasRole('ADMIN')")
```

and:

```java
@PreAuthorize("hasAuthority('USER_READ')")
```

---

# 17. Authentication Failure Handling

Authentication failures return standardized responses.

Unauthenticated request:

```text
401
AUTH_AUTHENTICATION_REQUIRED
```

Invalid credentials:

```text
401
AUTH_INVALID_CREDENTIALS
```

Access denied:

```text
403
AUTH_ACCESS_DENIED
```

Security filter failures are handled through:

```text
CustomAuthenticationEntryPoint
CustomAccessDeniedHandler
```

Method-security access-denied failures are handled through:

```text
GlobalExceptionHandler
```

---

# 18. Refresh Token System

Refresh tokens have been implemented.

Database:

```text
refresh_tokens
```

Refresh token characteristics:

- Cryptographically secure random value
- SHA-256 hash stored in database
- Raw token is returned to client
- Seven-day expiration
- Revocable
- Associated with a user
- Unique database hash

Endpoints:

```http
POST /api/auth/refresh
POST /api/auth/logout
```

---

# 19. Logout

Logout revokes the refresh token.

After logout:

```text
refresh token
     ↓
revoked = true
     ↓
cannot obtain new access token
```

The existing access token remains valid until its expiration.

Current access-token lifetime:

```text
15 minutes
```

---

# 20. Session Revocation

The platform supports revoking all refresh tokens for a user.

Implemented:

```text
revokeAllUserTokens(userId)
```

This is currently triggered when:

- Password is changed
- User is deactivated

This prevents old refresh tokens from creating new access tokens.

---

# 21. Change Password

Endpoint:

```http
POST /api/auth/change-password
```

Request:

```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

Features:

- Current password verification
- New password validation
- BCrypt hashing
- Password replacement
- All refresh tokens revoked after password change

---

# 22. User Management

Implemented endpoints:

```http
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

Permissions:

```text
GET    → USER_READ
POST   → USER_CREATE
PUT    → USER_UPDATE
DELETE → USER_DELETE
```

---

# 23. User Creation

Administrator can create users.

New users receive:

```text
ROLE_USER
```

by default.

Password is always BCrypt encoded.

---

# 24. User Update

User profile update supports:

```text
email
firstName
lastName
```

It does not directly modify:

```text
username
password
roles
```

This separation prevents profile management from becoming mixed with security/authorization management.

---

# 25. User Deactivation

Physical deletion is not currently used.

Instead:

```text
enabled = false
```

This is a soft-deactivation approach.

Deactivated users:

- Are omitted from normal active-user listing
- Cannot authenticate
- Have all refresh tokens revoked

---

# 26. Audit Logging

Audit logging has been implemented for **user-management/business actions only**.

Current actions:

```text
USER_REGISTERED
USER_CREATED
USER_UPDATED
USER_DEACTIVATED
```

Audit table:

```text
audit_logs
```

It records:

```text
id
user_id
action
resource_type
resource_id
details
ip_address
created_at
request_id
user_agent
```

Indexes exist for:

```text
user_id
action
created_at
request_id
```

### Important Decision

Authentication events are intentionally **not audited**.

Do NOT add audit events for:

```text
LOGIN_SUCCESS
LOGIN_FAILED
PASSWORD_CHANGED
TOKEN_REFRESHED
LOGOUT
```

unless this architecture is explicitly changed later.

---

# 27. Request Context

Request context has been implemented using `ThreadLocal`.

The platform generates or accepts:

```http
X-Request-ID
```

Every request receives a request ID.

Response contains:

```http
X-Request-ID: <request-id>
```

Request context currently tracks:

```text
requestId
clientIp
userAgent
```

The context is cleared after every request to prevent ThreadLocal leakage.

---

# 28. Audit Request Context

Audit records automatically obtain:

```text
requestId
clientIp
userAgent
```

from:

```text
RequestContext
```

Audit callers therefore do not need to manually pass the IP address.

This keeps audit-related code cleaner and consistent.

---

# 29. Swagger / OpenAPI

OpenAPI documentation has been added.

Swagger UI:

```text
/swagger-ui.html
```

OpenAPI specification:

```text
/v3/api-docs
```

JWT Bearer authentication is configured in Swagger.

Protected APIs can therefore be tested directly from Swagger after entering the access token.

---

# 30. Environment Configuration

Environment-specific configuration has been externalized.

Important variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD

JWT_SECRET
JWT_ACCESS_TOKEN_EXPIRATION

SERVER_PORT
```

Docker PostgreSQL configuration uses:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_PORT
```

`.env` is ignored by Git.

`.env.example` is committed.

Production secrets must never be committed.

---

# 31. Current Security Architecture

Current request flow:

```text
Client
  │
  │ Authorization: Bearer JWT
  ↓
RequestContextFilter
  │
  ├── Request ID
  ├── IP
  └── User-Agent
  │
  ↓
JwtAuthenticationFilter
  │
  ├── Extract JWT
  ├── Validate JWT
  ├── Load User
  └── Set SecurityContext
  │
  ↓
Spring Security
  │
  ↓
Controller
  │
  ↓
Service
  │
  ↓
Repository
  │
  ↓
PostgreSQL
```

Authorization:

```text
JWT
 ↓
User
 ↓
Roles
 ↓
Permissions
 ↓
@PreAuthorize
 ↓
Endpoint
```

---

# 32. Current Database Architecture

```text
users
  │
  ├──────── user_roles ──────── roles
  │                               │
  │                               │
  │                         role_permissions
  │                               │
  │                               ↓
  │                          permissions
  │
  ├──────── refresh_tokens
  │
  └──────── audit_logs
```

Flyway controls all schema changes.

---

# 33. Current Platform Capabilities

At this point the platform provides:

```text
[✓] Spring Boot foundation
[✓] PostgreSQL
[✓] Docker PostgreSQL
[✓] Flyway
[✓] JPA/Hibernate
[✓] User entity
[✓] Role entity
[✓] Permission entity
[✓] User registration
[✓] User login
[✓] JWT access token
[✓] Refresh token
[✓] Logout
[✓] Token revocation
[✓] Change password
[✓] User CRUD
[✓] User deactivation
[✓] Role authorization
[✓] Permission authorization
[✓] Standard API response
[✓] Global exception handling
[✓] Validation
[✓] Request ID
[✓] Request context
[✓] Audit logging
[✓] Swagger/OpenAPI
[✓] Environment configuration
[✓] Docker development environment
```

---

# 34. Remaining Development Roadmap

The platform is **not finished yet**.

The following areas should still be developed.

## Phase A — Complete Backend Foundation

### A1. Authorization Management APIs

Currently roles and permissions exist in the database, but management APIs should be added.

Need:

```http
GET    /api/roles
GET    /api/roles/{id}
POST   /api/roles
PUT    /api/roles/{id}
DELETE /api/roles/{id}
```

Permission management:

```http
GET    /api/permissions
GET    /api/permissions/{id}
POST   /api/permissions
PUT    /api/permissions/{id}
DELETE /api/permissions/{id}
```

Role assignment:

```http
PUT /api/users/{id}/roles
```

Permission assignment to roles:

```http
PUT /api/roles/{id}/permissions
```

These APIs should have appropriate authorization restrictions.

---

# 35. Phase B — Authentication Hardening

Need to consider:

- JWT secret validation at startup
- Password policy
- Account lockout
- Login attempt protection
- Token rotation
- Refresh-token rotation
- Token reuse detection
- Security headers
- CORS configuration
- Production HTTPS requirements
- Secure cookie option if refresh tokens are later moved to cookies

Important: do not over-engineer these until the basic platform is stable.

---

# 36. Phase C — User Security Features

Potential platform features:

```text
Forgot password
Reset password
Email verification
Account activation
Account locking/unlocking
Role management
Profile management
```

If email is added, an email provider abstraction should be created instead of directly coupling business logic to one provider.

---

# 37. Phase D — API Infrastructure

Need reusable infrastructure for:

### Pagination

Example:

```http
GET /api/users?page=0&size=20
```

Response should contain:

```text
content
page
size
totalElements
totalPages
```

### Sorting

```text
sort=createdAt,desc
```

### Filtering

A reusable filtering strategy should be established instead of implementing custom filtering separately for every future module.

---

# 38. Phase E — Common Backend Utilities

Build reusable components for:

```text
Pagination
Sorting
Filtering
Date/time handling
String utilities
Collection utilities
Validation utilities
```

Avoid creating unnecessary utility classes. Only add utilities when multiple modules genuinely need them.

---

# 39. Phase F — API Versioning

Decide and document API versioning.

Recommended structure:

```text
/api/v1/auth
/api/v1/users
/api/v1/roles
/api/v1/permissions
```

This becomes important once applications built on the platform have external clients.

---

# 40. Phase G — Observability

Add:

```text
Logging
Structured logging
Correlation/request IDs
Health checks
Metrics
Application information
```

Spring Boot Actuator is already available.

Potential endpoints:

```text
/actuator/health
/actuator/info
/actuator/metrics
```

Production exposure must be restricted.

---

# 41. Phase H — Logging Strategy

Establish a proper logging strategy.

Need to define:

```text
INFO
WARN
ERROR
DEBUG
```

Never log:

```text
Passwords
JWT tokens
Refresh tokens
Sensitive credentials
```

Logs should contain request IDs where useful.

---

# 42. Phase I — Testing

This is a major remaining phase.

Need:

### Unit tests

```text
UserCreationService
UserService
AuthService
RefreshTokenService
JwtService
```

### Repository tests

Test:

```text
UserRepository
RoleRepository
PermissionRepository
RefreshTokenRepository
```

### Controller/API tests

Test:

```text
registration
login
refresh
logout
change password
user CRUD
authorization
validation
```

### Security tests

Test:

```text
No token → 401
Invalid token → 401
Expired token → 401
Valid token → 200
Insufficient permission → 403
Admin → authorized
Deactivated user → denied
```

### Integration tests

Run application against a real PostgreSQL test environment.

---

# 43. Phase J — Testcontainers

After basic tests are implemented, use Testcontainers for integration testing.

Architecture:

```text
JUnit
  ↓
Spring Boot
  ↓
Testcontainers
  ↓
PostgreSQL
```

This avoids depending on the developer's local PostgreSQL instance.

---

# 44. Phase K — Frontend Foundation

Frontend still needs to be developed.

Recommended structure:

```text
frontend/
├── src/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   └── App.*
│
├── public/
└── package.json
```

Frontend should support:

```text
Login
Registration
Token handling
Refresh token handling
Logout
Protected routes
Role-based UI
Permission-based UI
API error handling
Standard API response handling
```

---

# 45. Phase L — Frontend Authentication Architecture

Recommended flow:

```text
Login
 ↓
Access Token
 ↓
Authenticated API calls
 ↓
401
 ↓
Refresh Token
 ↓
New Access Token
 ↓
Retry original request
```

Need to prevent multiple simultaneous refresh requests.

A centralized API client/interceptor should handle this.

---

# 46. Phase M — Docker Full Stack

Currently Docker is primarily being used for PostgreSQL.

Eventually create:

```text
docker-compose.yml
```

containing:

```text
frontend
backend
postgres
```

Architecture:

```text
Browser
   ↓
Frontend
   ↓
Backend
   ↓
PostgreSQL
```

---

# 47. Phase N — Production Configuration

Need separate configuration strategy for:

```text
development
test
staging
production
```

Production should use:

- External secrets
- Managed PostgreSQL
- HTTPS
- Secure JWT secret
- Restricted Actuator endpoints
- Proper CORS
- Production logging
- Database backups
- Monitoring

---

# 48. Phase O — Database Production Hardening

Need to review:

- Foreign keys
- Indexes
- Unique constraints
- Cascading rules
- Timestamp types
- Transaction boundaries
- Query performance
- Pagination queries
- Database connection pool
- Migration strategy

---

# 49. Phase P — Transaction Management

Review service methods and identify transaction boundaries.

Examples:

```text
Create user
Update user
Deactivate user
Change password
Refresh-token operations
Role assignment
Permission assignment
```

Use:

```java
@Transactional
```

where multiple database operations must succeed or fail together.

---

# 50. Phase Q — API Security Hardening

Before calling the platform production-ready:

```text
CORS
CSRF strategy
Security headers
Rate limiting
Brute-force protection
Request size limits
Input validation
Password policy
Secret management
JWT configuration validation
```

---

# 51. Phase R — Documentation

The platform should eventually contain:

```text
README.md
docs/
├── architecture/
├── authentication/
├── authorization/
├── database/
├── api/
├── deployment/
├── development/
└── security/
```

Documentation should explain:

- How to run the project
- How authentication works
- How authorization works
- How to create a new module
- How to add migrations
- How to add APIs
- How to add permissions
- How to deploy
- How to configure environments

---

# 52. Phase S — CI/CD

GitHub Actions should eventually provide:

```text
Push
 ↓
Build
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Static checks
 ↓
Package
 ↓
Docker image
```

Later:

```text
main
 ↓
CI
 ↓
Docker image
 ↓
Deployment
```

---

# 53. Phase T — Code Quality

Eventually introduce:

```text
Checkstyle
SpotBugs
SonarQube/SonarCloud
Dependency vulnerability scanning
```

Also establish:

- Naming conventions
- Package conventions
- DTO conventions
- Exception conventions
- API conventions
- Logging conventions
- Transaction conventions

---

# 54. Phase U — Reusable Business Module Pattern

Every future business feature should follow a predictable structure.

Example:

```text
features/project/
├── controller/
├── service/
├── dto/
├── entity/
├── repository/
├── exception/
└── mapper/
```

Business module:

```text
depends on
    ↓
Platform Foundation
```

Platform Foundation:

```text
must NOT depend on
    ↓
Business Module
```

This keeps the platform reusable.

---

# 55. Phase V — Platform Extraction

Once the repository is stable, consider extracting reusable modules into separate libraries.

Possible future structure:

```text
application-platform-common
application-platform-security
application-platform-auth
application-platform-user
application-platform-authorization
application-platform-audit
```

These could eventually become internal Maven dependencies or Spring Boot starters.

This should happen **after** the modular monolith has stabilized, not before.

---

# 56. Recommended Development Order From Here

The recommended sequence is:

```text
1. Authorization Management
        ↓
2. Pagination / Sorting
        ↓
3. API Versioning
        ↓
4. Security Hardening
        ↓
5. Observability
        ↓
6. Backend Unit Tests
        ↓
7. Backend Integration Tests
        ↓
8. Testcontainers
        ↓
9. React Frontend Foundation
        ↓
10. Frontend Authentication
        ↓
11. Frontend Authorization
        ↓
12. Full Docker Stack
        ↓
13. CI/CD
        ↓
14. Production Hardening
        ↓
15. Complete Documentation
        ↓
16. Platform Extraction
```

---

# 57. Important Architecture Decisions

The following decisions have already been made and should remain consistent unless there is a strong reason to change them:

### Architecture

```text
Modular Monolith
```

### Authentication

```text
JWT access token
+
Refresh token
```

### Access token

```text
15 minutes
```

### Refresh token

```text
7 days
```

### Password storage

```text
BCrypt
```

### Database migrations

```text
Flyway
```

### Hibernate schema mode

```text
validate
```

### User deletion

```text
Soft deactivation
```

using:

```text
enabled = false
```

### Authorization

```text
Role + Permission
```

### API response

```text
ApiResponse<T>
```

### Request tracing

```text
X-Request-ID
```

### Audit

Audit only user-management/business actions.

Authentication events are intentionally not audited.

### Configuration

```text
Environment variables
```

### Infrastructure

```text
Docker Compose
```

### API documentation

```text
OpenAPI / Swagger
```

---

# 58. Current Status

## Backend Foundation

**Core backend foundation is substantially complete.**

The platform can currently:

```text
✓ Start Spring Boot
✓ Connect PostgreSQL
✓ Run Flyway migrations
✓ Register users
✓ Authenticate users
✓ Issue JWT access tokens
✓ Issue refresh tokens
✓ Refresh access tokens
✓ Logout/revoke refresh tokens
✓ Change passwords
✓ Revoke user sessions
✓ Manage users
✓ Deactivate users
✓ Apply roles
✓ Apply permissions
✓ Protect endpoints
✓ Return standardized API responses
✓ Handle common API errors
✓ Generate request IDs
✓ Record user-management audit events
✓ Expose Swagger documentation
✓ Use environment-based configuration
```

## Still Required Before Calling It Production-Ready

```text
□ Role/permission management APIs
□ Pagination/filtering/sorting
□ API versioning
□ Security hardening
□ Observability
□ Comprehensive tests
□ Testcontainers
□ React frontend
□ Frontend authentication
□ Frontend authorization
□ Full Docker stack
□ CI/CD
□ Production deployment configuration
□ Production database hardening
□ Complete documentation
□ Code-quality tooling
```

---

# 59. Immediate Next Step

The next implementation step should be:

## Step 31 — Role & Permission Management

We will build the authorization-management layer:

```text
Role APIs
Permission APIs
User ↔ Role assignment
Role ↔ Permission assignment
```

After that, the platform will have both:

```text
Authentication
```

and

```text
Authorization Management
```

rather than only authorization enforcement.