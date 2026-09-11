package com.vijay.platform.authentication.controller;

import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.service.UserService;
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
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        User user= userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
