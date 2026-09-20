package com.vijay.platform.authentication.service;

import com.vijay.platform.audit.AuditAction;
import com.vijay.platform.audit.service.AuditService;
import com.vijay.platform.authentication.dto.*;
import com.vijay.platform.authentication.exception.InvalidCurrentPasswordException;
import com.vijay.platform.authorization.entity.Permission;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.security.entity.RefreshToken;
import com.vijay.platform.security.jwt.JwtService;
import com.vijay.platform.security.service.RefreshTokenService;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import com.vijay.platform.user.service.UserCreationService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final UserCreationService userCreationService;
    private final AuditService auditService;

    public LoginResponse login(LoginRequest request){
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
        User user=userRepository.findByUsername(request.getUsername()).orElseThrow();
        String accessToken= jwtService.generateAccessToken(user.getUsername());
        String refreshToken=refreshTokenService.createRefreshToken(user);
        Set<String> roles=user.getRoles().stream().map(role-> role.getName()).collect(Collectors.toSet());
        Set<String> permissions=user.getRoles().stream().flatMap(role->role.getPermissions().stream()).map(permission -> permission.getName()).collect(Collectors.toSet());
        return new LoginResponse(accessToken,"Bearer", jwtService.getAccessTokenExpiration()/1000, user.getId(), user.getUsername(), roles,permissions,refreshToken);
    }
    @Transactional
    public RegisterResponse register(RegisterRequest request) {


        User user = userCreationService.create(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName()
        );
        auditService.log(
                user,
                AuditAction.USER_REGISTERED,
                "USER",
                user.getId().toString(),
                "User registered"
        );

        return new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }

    public void changePassword(
            String username,
            ChangePasswordRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new InvalidCurrentPasswordException();
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
        refreshTokenService.revokeAllUserTokens(user.getId());
    }

    public LoginResponse refreshAccessToken(
            String rawRefreshToken) {

        RefreshToken refreshToken =
                refreshTokenService.validateRefreshToken(
                        rawRefreshToken
                );

        User user = refreshToken.getUser();

        String accessToken =
                jwtService.generateAccessToken(
                        user.getUsername()
                );

        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        Set<String> permissions = user.getRoles()
                .stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .collect(Collectors.toSet());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(900)
                .userId(user.getId())
                .username(user.getUsername())
                .roles(roles)
                .permissions(permissions)
                .build();
    }
}
