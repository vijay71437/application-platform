package com.vijay.platform.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {

        JwtProperties jwtProperties = new JwtProperties();

        jwtProperties.setSecret(
                "test-secret-key-that-is-at-least-32-characters-long"
        );

        jwtProperties.setAccessTokenExpiration(900000);

        jwtService = new JwtService(jwtProperties);
    }

    @Test
    void shouldGenerateAccessToken() {

        String token = jwtService.generateAccessToken("vijay");

        assertThat(token)
                .isNotNull()
                .isNotBlank();
    }

    @Test
    void shouldExtractUsernameFromToken() {

        String token =
                jwtService.generateAccessToken("vijay");

        String username =
                jwtService.extractUsername(token);

        assertThat(username)
                .isEqualTo("vijay");
    }

    @Test
    void shouldValidateGeneratedToken() {

        String token =
                jwtService.generateAccessToken("vijay");

        boolean valid =
                jwtService.isTokenValid(token);

        assertThat(valid)
                .isTrue();
    }



    @Test
    void shouldRejectInvalidToken() {

        assertThatThrownBy(() ->
                jwtService.extractUsername("invalid.jwt.token")
        ).isInstanceOf(RuntimeException.class);
    }

    @Test
    void shouldReturnConfiguredExpiration() {

        assertThat(jwtService.getAccessTokenExpiration())
                .isEqualTo(900000);
    }
}