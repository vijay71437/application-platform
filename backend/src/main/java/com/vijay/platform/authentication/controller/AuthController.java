package com.vijay.platform.authentication.controller;

import com.vijay.platform.authentication.dto.*;
import com.vijay.platform.authentication.service.AuthService;
import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.security.service.RefreshTokenService;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        RegisterResponse response= authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body( ApiResponse.success(
                "User registered successfully",
                response
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        response
                )
        );
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        authService.changePassword(
                authentication.getName(),
                request
        );

        return ApiResponse.success(
                "Password changed successfully",
                null
        );
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {

        return ApiResponse.success(
                "Access token refreshed successfully",
                authService.refreshAccessToken(
                        request.getRefreshToken()
                )
        );
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @Valid @RequestBody LogoutRequest request) {

        refreshTokenService.revokeRefreshToken(
                request.getRefreshToken()
        );

        return ApiResponse.success(
                "Logout successful",
                null
        );
    }
}
