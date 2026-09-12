package com.vijay.platform.common.controller;

import com.vijay.platform.common.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> adminEndpoint() {
        return ApiResponse.success(
                "Admin access successful",
                "You have ADMIN role"
        );
    }

    @GetMapping("/protected")
    public ApiResponse<String> protectedEndpoint(
            Authentication authentication) {

        return ApiResponse.success(
                "Authenticated request successful",
                "Hello " + authentication.getName()
        );
    }

    @GetMapping("/api/test/user-read")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ApiResponse<String> userReadEndpoint() {

        return ApiResponse.success(
                "Permission check successful",
                "You have USER_READ permission"
        );
    }
}
