package com.vijay.platform.user.controller;

import com.vijay.platform.authorization.dto.AssignRolesRequest;
import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.user.dto.UpdateUserRequest;
import com.vijay.platform.user.dto.UserResponse;
import com.vijay.platform.user.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ApiResponse<List<UserResponse>> getAllUsers() {

        return ApiResponse.success(
                "Users retrieved successfully",
                userService.getAllUsers()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ApiResponse<UserResponse> getUserById(
            @PathVariable Long id) {

        return ApiResponse.success(
                "User retrieved successfully",
                userService.getUserById(id)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        return ApiResponse.success(
                "User updated successfully",
                userService.updateUser(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ApiResponse<UserResponse> deleteUser(
            @PathVariable Long id) {

        return ApiResponse.success(
                "User deactivated successfully",
                userService.deactivateUser(id)
        );
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> assignRoles(
            @PathVariable Long id,
            @Valid @RequestBody AssignRolesRequest request) {

        return ApiResponse.success(
                "User roles updated successfully",
                userService.assignRoles(id, request)
        );
    }
}