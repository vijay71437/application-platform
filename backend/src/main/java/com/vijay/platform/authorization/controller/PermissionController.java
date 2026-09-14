package com.vijay.platform.authorization.controller;

import com.vijay.platform.authorization.dto.CreatePermissionRequest;
import com.vijay.platform.authorization.dto.PermissionResponse;
import com.vijay.platform.authorization.dto.UpdatePermissionRequest;
import com.vijay.platform.authorization.service.PermissionService;
import com.vijay.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {

        return ApiResponse.success(
                "Permissions retrieved successfully",
                permissionService.getAllPermissions()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PermissionResponse> getPermissionById(
            @PathVariable Long id) {

        return ApiResponse.success(
                "Permission retrieved successfully",
                permissionService.getPermissionById(id)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PermissionResponse> createPermission(
            @Valid @RequestBody CreatePermissionRequest request) {

        return ApiResponse.success(
                "Permission created successfully",
                permissionService.createPermission(request)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PermissionResponse> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePermissionRequest request) {

        return ApiResponse.success(
                "Permission updated successfully",
                permissionService.updatePermission(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deletePermission(
            @PathVariable Long id) {

        permissionService.deletePermission(id);

        return ApiResponse.success(
                "Permission deleted successfully",
                null
        );
    }
}