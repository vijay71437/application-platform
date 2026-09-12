package com.vijay.platform.authentication.service;

import com.vijay.platform.authentication.dto.LoginRequest;
import com.vijay.platform.authentication.dto.LoginResponse;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.security.jwt.JwtService;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request){
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
        User user=userRepository.findByUsername(request.getUsername()).orElseThrow();
        String accessToken= jwtService.generateAccessToken(user.getUsername());
        Set<String> roles=user.getRoles().stream().map(role-> role.getName()).collect(Collectors.toSet());
        Set<String> permissions=user.getRoles().stream().flatMap(role->role.getPermissions().stream()).map(permission -> permission.getName()).collect(Collectors.toSet());
        return new LoginResponse(accessToken,"Bearer", jwtService.getAccessTokenExpiration()/1000, user.getId(), user.getUsername(), roles,permissions);
    }
}
