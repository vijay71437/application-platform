package com.vijay.platform.authorization.controller;

import com.vijay.platform.authorization.dto.AssignPermissionsRequest;
import com.vijay.platform.authorization.dto.CreateRoleRequest;
import com.vijay.platform.authorization.dto.RoleResponse;
import com.vijay.platform.authorization.dto.UpdateRoleRequest;
import com.vijay.platform.authorization.service.RoleService;
import com.vijay.platform.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/roles")
@SecurityRequirement(name = "bearerAuth")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<RoleResponse>> getAllRoles(){
          return ApiResponse.success("Roles retrieved successfully",roleService.getAllRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable Long id){
        return ApiResponse.success("Roles retrieved successfully",roleService.getRoleById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request) {

        return ApiResponse.success(
                "Role created successfully",
                roleService.createRole(request)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {

        return ApiResponse.success(
                "Role updated successfully",
                roleService.updateRole(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteRole(
            @PathVariable Long id) {

        roleService.deleteRole(id);

        return ApiResponse.success(
                "Role deleted successfully",
                null
        );
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> assignPermissions(
            @PathVariable Long id,
            @Valid @RequestBody AssignPermissionsRequest request) {

        return ApiResponse.success(
                "Role permissions updated successfully",
                roleService.assignPermissions(id, request)
        );
    }

}
