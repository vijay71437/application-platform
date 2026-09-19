package com.vijay.platform.user.service;

import com.vijay.platform.audit.AuditAction;
import com.vijay.platform.audit.service.AuditService;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.authorization.repository.RoleRepository;
import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserCreationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserCreationService userCreationService;
    @Mock
    private AuditService auditService;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");
    }

    @Test
    void shouldCreateUserSuccessfully() {

        when(userRepository.existsByUsername("vijay"))
                .thenReturn(false);

        when(userRepository.existsByEmail("vijay@gmail.com"))
                .thenReturn(false);

        when(roleRepository.findByName("ROLE_USER"))
                .thenReturn(Optional.of(userRole));

        when(passwordEncoder.encode("password123"))
                .thenReturn("encoded-password");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("vijay");
        savedUser.setEmail("vijay@gmail.com");
        savedUser.setPassword("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        User result = userCreationService.create(
                "vijay",
                "vijay@gmail.com",
                "password123",
                "Vijay",
                "Mali"
        );

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("vijay");
        assertThat(result.getPassword()).isEqualTo("encoded-password");

        verify(userRepository).existsByUsername("vijay");
        verify(userRepository).existsByEmail("vijay@gmail.com");
        verify(roleRepository).findByName("ROLE_USER");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(auditService).log(
                savedUser,
                AuditAction.USER_CREATED,
                "USER",
                "1",
                "User created by administrator"
        );
    }

    @Test
    void shouldRejectDuplicateUsername() {

        when(userRepository.existsByUsername("vijay"))
                .thenReturn(true);

        assertThatThrownBy(() ->
                userCreationService.create(
                        "vijay",
                        "vijay@gmail.com",
                        "password123",
                        "Vijay",
                        "Mali"
                )
        )
                .isInstanceOf(BusinessException.class);

        verify(userRepository).existsByUsername("vijay");

        verify(userRepository, never())
                .existsByEmail(anyString());

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void shouldRejectDuplicateEmail() {

        when(userRepository.existsByUsername("vijay"))
                .thenReturn(false);

        when(userRepository.existsByEmail("vijay@gmail.com"))
                .thenReturn(true);

        assertThatThrownBy(() ->
                userCreationService.create(
                        "vijay",
                        "vijay@gmail.com",
                        "password123",
                        "Vijay",
                        "Mali"
                )
        )
                .isInstanceOf(BusinessException.class);

        verify(userRepository).existsByUsername("vijay");
        verify(userRepository).existsByEmail("vijay@gmail.com");

        verify(userRepository, never())
                .save(any(User.class));
    }
}