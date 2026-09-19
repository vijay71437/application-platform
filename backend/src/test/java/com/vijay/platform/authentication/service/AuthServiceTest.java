package com.vijay.platform.authentication.service;

import com.vijay.platform.authentication.dto.ChangePasswordRequest;
import com.vijay.platform.authentication.dto.LoginRequest;
import com.vijay.platform.security.jwt.JwtService;
import com.vijay.platform.security.service.RefreshTokenService;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;


import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.util.Assert.isInstanceOf;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("vijay");
        user.setEmail("vijay@gmail.com");
        user.setPassword("encoded-password");
        user.setEnabled(true);
        user.setAccountLocked(false);
    }

    @Test
    void shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setUsername("vijay");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(
                UsernamePasswordAuthenticationToken.class
        ))).thenReturn(authentication);

        when(userRepository.findByUsername("vijay"))
                .thenReturn(Optional.of(user));

        when(jwtService.generateAccessToken(any()))
                .thenReturn("access-token");

        when(refreshTokenService.createRefreshToken(user))
                .thenReturn("refresh-token");

        var result = authService.login(request);

        assertThat(result).isNotNull();
        assertThat(result.getAccessToken())
                .isEqualTo("access-token");
        assertThat(result.getRefreshToken())
                .isEqualTo("refresh-token");

        verify(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        verify(jwtService)
                .generateAccessToken(any());

        verify(refreshTokenService)
                .createRefreshToken(user);
    }

    @Test
    void shouldRejectInvalidCredentials() {

        LoginRequest request = new LoginRequest();
        request.setUsername("vijay");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(
                UsernamePasswordAuthenticationToken.class
        ))).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() ->
                authService.login(request)
        )
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never())
                .generateAccessToken(any());

        verify(refreshTokenService, never())
                .createRefreshToken(any());
    }

    @Test
    void shouldChangePasswordSuccessfully() {

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("old-password");
        request.setNewPassword("new-password123");

        when(userRepository.findByUsername("vijay"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "old-password",
                "encoded-password"
        )).thenReturn(true);

        when(passwordEncoder.encode("new-password123"))
                .thenReturn("new-encoded-password");

        authService.changePassword("vijay", request);

        assertThat(user.getPassword())
                .isEqualTo("new-encoded-password");

        verify(passwordEncoder)
                .matches("old-password", "encoded-password");

        verify(passwordEncoder)
                .encode("new-password123");

        verify(userRepository)
                .save(user);

        verify(refreshTokenService)
                .revokeAllUserTokens(1L);
    }

    @Test
    void shouldRejectIncorrectCurrentPassword() {

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrong-password");
        request.setNewPassword("new-password123");

        when(userRepository.findByUsername("vijay"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrong-password",
                "encoded-password"
        )).thenReturn(false);

        assertThatThrownBy(() ->
                authService.changePassword("vijay", request)
        )
                .isInstanceOf(RuntimeException.class);

        verify(passwordEncoder, never())
                .encode(anyString());

        verify(userRepository, never())
                .save(any(User.class));

        verify(refreshTokenService, never())
                .revokeAllUserTokens(anyLong());
    }
}