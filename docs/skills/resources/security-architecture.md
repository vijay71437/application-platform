# Security Architecture

## Overview

The platform uses **stateless JWT authentication** with a **refresh token** mechanism stored in PostgreSQL. Authorization is enforced via **Spring Security method-level guards** backed by RBAC.

---

## Authentication Flow

```
Client                    Server
  │                          │
  ├─ POST /auth/login ───────►│
  │   {username, password}    │ 1. AuthenticationManager authenticates
  │                          │ 2. JwtService generates access token (15 min)
  │                          │ 3. RefreshTokenService creates refresh token (DB)
  │◄─ {accessToken,          │
  │    refreshToken} ─────────│
  │                          │
  ├─ GET /api/v1/* ──────────►│
  │   Authorization: Bearer   │ 4. JwtAuthenticationFilter validates JWT
  │                          │ 5. Sets SecurityContext
  │◄─ response ───────────────│
  │                          │
  ├─ POST /auth/refresh ──────►│
  │   {refreshToken}          │ 6. RefreshTokenService validates DB token
  │                          │ 7. JwtService issues new access token
  │◄─ {new accessToken} ──────│
  │                          │
  ├─ POST /auth/logout ───────►│
  │   {refreshToken}          │ 8. RefreshToken revoked in DB
  │◄─ success ────────────────│
```

---

## Components

### JwtService (`security/jwt/JwtService.java`)
- Generates signed access tokens using HMAC-SHA256
- Extracts claims (username, expiration)
- Validates token signature and expiration
- Config via `JwtProperties` (from `application.properties`):
  - `jwt.secret` → signing key
  - `jwt.access-token-expiration` → TTL in ms (default 900000 = 15 min)

### JwtAuthenticationFilter (`security/jwt/JwtAuthenticationFilter.java`)
- Intercepts every HTTP request
- Reads `Authorization: Bearer <token>` header
- Validates token → loads `UserDetails` via `CustomUserDetailsService`
- Sets `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`

### RefreshToken Entity (`security/entity/RefreshToken.java`)
```
refresh_tokens table:
  id          BIGINT PK
  user_id     FK → users
  token       TEXT (UUID, unique)
  expires_at  TIMESTAMP
  revoked     BOOLEAN
  created_at  TIMESTAMP
```

### RefreshTokenService
- `createRefreshToken(User)` → generates UUID, persists in DB
- `validateRefreshToken(token)` → checks existence, not revoked, not expired
- `revokeRefreshToken(token)` → marks single token revoked
- `revokeAllUserTokens(userId)` → marks all tokens for user revoked (called on password change)

### CustomUserDetailsService
- Loads `User` by username from `UserRepository`
- Returns Spring Security `UserDetails` with:
  - Username and encoded password
  - Authorities: all `Permission` names from all user `Role`s (e.g., `USER_READ`)
  - Role-based authorities prefixed with `ROLE_` (e.g., `ROLE_ADMIN`)

---

## Authorization (RBAC)

### Model
```
User ─── user_roles ─── Role ─── role_permissions ─── Permission
```

- A User can have **many Roles**
- A Role can have **many Permissions**
- Method security uses:
  - `@PreAuthorize("hasAuthority('PERMISSION_NAME')")` — checks Permission name
  - `@PreAuthorize("hasRole('ROLE_NAME')")` — checks Role (Spring strips `ROLE_` prefix)
  - `@PreAuthorize("isAuthenticated()")` — just needs valid JWT

### Default Roles (seeded by migration V6)
- `ADMIN` — full access (all permissions via V8)
- `USER` — basic access

### Default Permissions (seeded by migration V7)
| Permission | Description |
|-----------|-------------|
| `USER_READ` | Read user information |
| `USER_UPDATE` | Update user details |
| `USER_DELETE` | Deactivate users |
| `ROLE_READ` | Read roles |
| `ROLE_CREATE` | Create roles |
| `ROLE_UPDATE` | Update roles |
| `ROLE_DELETE` | Delete roles |
| `PERMISSION_READ` | Read permissions |
| `PERMISSION_CREATE` | Create permissions |
| `PERMISSION_UPDATE` | Update permissions |
| `PERMISSION_DELETE` | Delete permissions |

---

## SecurityConfig Summary

```java
// Public paths (no auth required)
"/api/v1/auth/register"
"/api/v1/auth/login"
"/api/v1/auth/refresh"
"/api/v1/auth/logout"
"/api/health"
"/swagger-ui/**"
"/swagger-ui.html"
"/v3/api-docs/**"
"/actuator/**"
```

CORS allows all origins configured in `SecurityProperties.cors.allowedOrigins`.  
Allowed methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`  
Allowed headers: `Authorization, Content-Type, X-Request-ID`  
Session: `STATELESS` (no server-side session)

---

## Error Handlers

### CustomAuthenticationEntryPoint
Returns `401 Unauthorized` JSON when a request reaches a protected endpoint without a valid JWT:
```json
{
  "success": false,
  "message": "Authentication required",
  "errorCode": "UNAUTHORIZED"
}
```

### CustomAccessDeniedHandler
Returns `403 Forbidden` JSON when a valid JWT exists but the user lacks required permission:
```json
{
  "success": false,
  "message": "Access denied",
  "errorCode": "ACCESS_DENIED"
}
```

---

## Password Security
- BCryptPasswordEncoder (strength: Spring default = 10 rounds)
- Password validation done before encoding
- Old password verified before changing to new password

---

## Request Context (ThreadLocal)

`PlatformRequestContextFilter` populates per-request (via `RequestContext` ThreadLocal):
- `requestId` — UUID generated per request, returned in `X-Request-ID` header
- `clientIp` — extracted from `X-Forwarded-For` or `RemoteAddr`
- `userAgent` — from request header

`RequestLoggingFilter` logs request method, URI, IP, and duration.

All `ApiResponse` objects automatically include `requestId` from `RequestContext`.
