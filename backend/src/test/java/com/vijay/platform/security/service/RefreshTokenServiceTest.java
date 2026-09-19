package com.vijay.platform.security.service;

import com.vijay.platform.security.entity.RefreshToken;
import com.vijay.platform.security.repository.RefreshTokenRepository;
import com.vijay.platform.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("vijay");
        user.setEmail("vijay@gmail.com");
    }

    @Test
    void shouldCreateRefreshToken() {

        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String token = refreshTokenService.createRefreshToken(user);

        assertThat(token)
                .isNotNull()
                .isNotBlank();

        verify(refreshTokenRepository)
                .save(any(RefreshToken.class));
    }

    @Test
    void shouldValidateRefreshToken() {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setId(1L);
        refreshToken.setUser(user);
        refreshToken.setTokenHash("hashed-token");
        refreshToken.setExpiresAt(
                LocalDateTime.now().plusSeconds(3600)
        );
        refreshToken.setRevoked(false);

        when(refreshTokenRepository.findByTokenHashWithUser(anyString()))
                .thenReturn(Optional.of(refreshToken));

        RefreshToken result =
                refreshTokenService.validateRefreshToken("valid-refresh-token");

        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(user);

        verify(refreshTokenRepository)
                .findByTokenHashWithUser(anyString());
    }

    @Test
    void shouldRejectRevokedRefreshToken() {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setId(1L);
        refreshToken.setUser(user);
        refreshToken.setTokenHash("hashed-token");
        refreshToken.setExpiresAt(
                LocalDateTime.now().plusSeconds(3600)
        );
        refreshToken.setRevoked(true);

        when(refreshTokenRepository.findByTokenHashWithUser(anyString()))
                .thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() ->
                refreshTokenService.validateRefreshToken("token")
        )
                .isInstanceOf(RuntimeException.class);

        verify(refreshTokenRepository)
                .findByTokenHashWithUser(anyString());
    }

    @Test
    void shouldRejectExpiredRefreshToken() {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setId(1L);
        refreshToken.setUser(user);
        refreshToken.setTokenHash("hashed-token");
        refreshToken.setExpiresAt(
                LocalDateTime.now().minusSeconds(3600)
        );
        refreshToken.setRevoked(false);

        when(refreshTokenRepository.findByTokenHashWithUser(anyString()))
                .thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() ->
                refreshTokenService.validateRefreshToken("token")
        )
                .isInstanceOf(RuntimeException.class);

        verify(refreshTokenRepository)
                .findByTokenHashWithUser(anyString());
    }

    @Test
    void shouldRevokeAllUserTokens() {

        refreshTokenService.revokeAllUserTokens(1L);

        verify(refreshTokenRepository)
                .findAllByUserIdAndRevokedFalse(1L);
    }
}