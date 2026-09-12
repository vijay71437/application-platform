package com.vijay.platform.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;
@AllArgsConstructor
@Getter
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String username;
    private Set<String> roles;
    private Set<String> permissions;

}