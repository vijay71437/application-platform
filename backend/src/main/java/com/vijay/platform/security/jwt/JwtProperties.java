package com.vijay.platform.security.jwt;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    @NotBlank(message = "JWT Secrete must be Configured")
    @Size(min = 32,message = "JWT secrete must contains at least 32 characters")
    private String secret;
    @Min(value = 60000, message = "JWT access token expiration must be at least 60000 ms")
    private long accessTokenExpiration;
}
