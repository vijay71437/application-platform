package com.vijay.platform.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;
@AllArgsConstructor
@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String username;
    private Set<String> roles;
    private Set<String> permissions;
    private String refreshToken;

}