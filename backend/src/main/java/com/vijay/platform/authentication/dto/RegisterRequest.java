package com.vijay.platform.authentication.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(min = 3,max=100)
    private String username;
    @NotBlank
    @Email
    @Size(max=255)
    private String email;
    @NotBlank
    @Size(max = 255)
    private String password;
    @NotBlank
    @Size(max=100)
    private String firstName;
    @NotBlank
    @Size(max=100)
    private String lastName;
}
