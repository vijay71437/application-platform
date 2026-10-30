# Common Patterns & Reusable Code

## Response Patterns

### Standard Success Response
```java
// Simple data response
return ApiResponse.success("Message", data);

// In a controller returning ResponseEntity
return ResponseEntity.status(HttpStatus.CREATED)
    .body(ApiResponse.success("Resource created successfully", data));

// Returning ApiResponse directly (auto-wraps in 200 OK)
return ApiResponse.success("Message", data);

// Void response
return ApiResponse.success("Operation completed", null);
```

### Standard Error Response
```java
// Via GlobalExceptionHandler (automatic)
throw new UserNotFoundException("User not found");

// Manual error response
return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    .body(ApiResponse.error("Invalid input", "VALIDATION_ERROR", null));
```

---

## Exception Patterns

### Creating a Domain Exception
```java
// 1. Create exception class
public class MyEntityNotFoundException extends BusinessException {
    public MyEntityNotFoundException(Long id) {
        super("MyEntity not found: " + id, "MY_ENTITY_NOT_FOUND");
    }
}

// 2. Register in GlobalExceptionHandler
@ExceptionHandler(MyEntityNotFoundException.class)
public ResponseEntity<ApiResponse<Void>> handleMyEntityNotFound(MyEntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode(), null));
}

// 3. Throw in service
public MyEntity findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new MyEntityNotFoundException(id));
}
```

### Error Code Convention
```java
// Pattern: MODULE_ACTION or MODULE_ENTITY_ACTION
"USER_NOT_FOUND"
"ROLE_ALREADY_EXISTS"
"PERMISSION_IN_USE"
"FINANCE_TRANSACTION_NOT_FOUND"
"COMMON_VALIDATION_ERROR"
```

---

## Pagination Pattern

### Controller
```java
@GetMapping
public ApiResponse<PageResponse<MyDto>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDirection,
        @RequestParam(required = false) String search) {

    PaginationRequest pagination = new PaginationRequest(page, size, sortBy, sortDirection);
    return ApiResponse.success("Retrieved successfully", service.getAll(pagination, search));
}
```

### Service
```java
public PageResponse<MyDto> getAll(PaginationRequest pagination, String search) {
    Pageable pageable = PageRequest.of(
        pagination.getPage(),
        pagination.getSize(),
        Sort.by(pagination.getSortDirection(), pagination.getSortBy())
    );

    Page<MyEntity> page = repository.findAll(pageable);

    return PageResponse.<MyDto>builder()
        .content(page.getContent().stream().map(this::toDto).toList())
        .page(page.getNumber())
        .size(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .first(page.isFirst())
        .last(page.isLast())
        .build();
}
```

---

## JPA Specification Pattern (Search/Filter)

```java
// Specification class
public class MyEntitySpecification {

    public static Specification<MyEntity> hasName(String name) {
        return (root, query, cb) ->
            name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<MyEntity> hasType(MyType type) {
        return (root, query, cb) ->
            type == null ? null : cb.equal(root.get("type"), type);
    }
}

// Repository: extend JpaSpecificationExecutor<MyEntity>
public interface MyEntityRepository extends JpaRepository<MyEntity, Long>,
        JpaSpecificationExecutor<MyEntity> {}

// Usage in service
Specification<MyEntity> spec = Specification
    .where(MyEntitySpecification.hasName(search))
    .and(MyEntitySpecification.hasType(type));

List<MyEntity> results = repository.findAll(spec);
```

---

## Audit Logging Pattern

```java
@Service
@AllArgsConstructor
public class MyService {

    private final AuditService auditService;

    public MyDto createThing(User currentUser, CreateMyThingRequest request) {
        // ... business logic ...

        auditService.log(
            currentUser,
            AuditAction.USER_CREATED,  // or your own constant
            "MY_THING",                // resource type
            savedEntity.getId().toString(),
            "Created thing: " + savedEntity.getName()
        );

        return toDto(savedEntity);
    }
}
```

### AuditAction Constants Available
```java
AuditAction.USER_REGISTERED
AuditAction.USER_CREATED
AuditAction.USER_UPDATED
AuditAction.USER_DEACTIVATED
AuditAction.LOGIN_SUCCESS
AuditAction.LOGIN_FAILED
AuditAction.PASSWORD_CHANGED
AuditAction.TOKEN_REFRESHED
AuditAction.LOGOUT
```

---

## Security Context (Get Current User)

```java
// In a controller method
@GetMapping("/my-resource")
public ApiResponse<MyDto> getMyResource(Authentication authentication) {
    String username = authentication.getName();
    return ApiResponse.success("OK", service.getForUser(username));
}

// Helper used in FinanceAccountController
private String getUsername(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
    }
    return authentication.getName();
}
```

---

## Adding a New Feature Module Checklist

```
□ Create package: com.vijay.platform.<module>/
□ Sub-packages:
  □ controller/      — @RestController, @RequestMapping(ApiConstants.API_V1 + "/path")
  □ dto/             — Request/Response records or classes (use Lombok)
  □ entity/          — @Entity, @Table, @Getter @Setter
  □ repository/      — extends JpaRepository<Entity, Long>
  □ service/         — business logic
  □ exception/       — extend BusinessException

□ Controller checklist:
  □ @SecurityRequirement(name = "bearerAuth")
  □ @PreAuthorize on each method
  □ Return ApiResponse<T> or ResponseEntity<ApiResponse<T>>

□ Exception checklist:
  □ Exception extends BusinessException with unique error code
  □ Register handler in GlobalExceptionHandler

□ Database checklist:
  □ Add Flyway migration V{n}__create_<table>.sql
  □ Migration file in: src/main/resources/db/migration/

□ Audit checklist (if needed):
  □ Add action constants to AuditAction (or create module-specific class)
  □ Call auditService.log() in service methods

□ OpenAPI:
  □ Controller-level @SecurityRequirement is sufficient
  □ Add @Operation annotations for custom descriptions (optional)
```

---

## GlobalExceptionHandler — Registered Exception Map

| Exception | HTTP Status | Error Code |
|-----------|-------------|------------|
| `MethodArgumentNotValidException` | 400 | `COMMON_VALIDATION_ERROR` |
| `HttpMessageNotReadableException` | 400 | `COMMON_INVALID_REQUEST_BODY` |
| `MissingServletRequestParameterException` | 400 | `COMMON_MISSING_PARAMETER` |
| `MethodArgumentTypeMismatchException` | 400 | `COMMON_INVALID_PARAMETER` |
| `InvalidParameterException` | 400 | per exception |
| `InvalidResourceReferenceException` | 400 | per exception |
| `UsernameNotFoundException` | 404 | - |
| `UserNotFoundException` | 404 | per exception |
| `RoleNotFoundException` | 404 | per exception |
| `PermissionNotFoundException` | 404 | per exception |
| `EmailAlreadyExistsException` | 409 | per exception |
| `UsernameAlreadyExistsException` | 409 | per exception |
| `RoleAlreadyExistsException` | 409 | per exception |
| `PermissionAlreadyExistsException` | 409 | per exception |
| `RoleInUseException` | 409 | per exception |
| `PermissionInUseException` | 409 | per exception |
| `InvalidCurrentPasswordException` | 400/422 | per exception |
| `InvalidRefreshTokenException` | 401 | per exception |
| `BusinessException` | 409 | per exception |
| `Exception` (catch-all) | 500 | `INTERNAL_SERVER_ERROR` |

---

## ApiConstants

```java
ApiConstants.API_V1 = "/api/v1"
```

---

## RequestContext Usage

```java
// Read in any component (populated by PlatformRequestContextFilter)
String requestId = RequestContext.getRequestId();
String clientIp  = RequestContext.getClientIp();
String userAgent = RequestContext.getUserAgent();

// Always cleared after request by the filter (finally block)
```

---

## Docker Compose

The project ships with a `docker-compose.yml` for PostgreSQL:
```bash
cd /Users/vijaykumarmali/Documents/projects/application-platform
docker compose up -d
```

Default PostgreSQL: port `5433`, DB `application_platform`, user `platform_user`

## Running the Backend

```bash
cd /Users/vijaykumarmali/Documents/projects/application-platform/backend
./mvnw spring-boot:run
```

Or build and run:
```bash
./mvnw clean package -DskipTests
java -jar target/application-platform-0.0.1-SNAPSHOT.jar
```
