package com.vijay.platform.user.service;

import com.vijay.platform.audit.service.AuditService;
import com.vijay.platform.security.service.RefreshTokenService;
import com.vijay.platform.user.dto.CreateUserRequest;
import com.vijay.platform.user.dto.UpdateUserRequest;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import com.vijay.platform.user.exception.UserNotFoundException;
import com.vijay.platform.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserCreationService userCreationService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private UserServiceImpl userService;
    @Mock
    private AuditService auditService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("vijay");
        user.setEmail("vijay@gmail.com");
        user.setFirstName("Vijay");
        user.setLastName("Mali");
        user.setEnabled(true);
        user.setAccountLocked(false);
    }

    @Test
    void shouldGetUserById() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        var result = userService.getUserById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("vijay");
        assertThat(result.getEmail()).isEqualTo("vijay@gmail.com");

        verify(userRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userService.getUserById(99L)
        )
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository).findById(99L);
    }

    @Test
    void shouldDeactivateUserAndRevokeTokens() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        var result = userService.deactivateUser(1L);

        assertThat(result).isNotNull();

        assertThat(user.isEnabled())
                .isFalse();

        verify(userRepository).findById(1L);
        verify(userRepository).save(user);

        verify(refreshTokenService)
                .revokeAllUserTokens(1L);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistingUser() {

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                userService.deactivateUser(99L)
        )
                .isInstanceOf(UserNotFoundException.class);

        verify(refreshTokenService, never())
                .revokeAllUserTokens(anyLong());

        verify(userRepository, never())
                .save(any(User.class));
    }
}