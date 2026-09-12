package com.vijay.platform.authentication.controller;

import com.vijay.platform.authentication.dto.LoginRequest;
import com.vijay.platform.authentication.dto.LoginResponse;
import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.authentication.dto.RegisterResponse;
import com.vijay.platform.authentication.service.AuthService;
import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        User user= userService.register(request);
        RegisterResponse response = new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
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
}
