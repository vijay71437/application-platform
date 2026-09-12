package com.vijay.platform.user.service.impl;

import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.authorization.repository.RoleRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.exception.EmailAlreadyExistsException;
import com.vijay.platform.user.exception.UsernameAlreadyExistsException;
import com.vijay.platform.user.repository.UserRepository;
import com.vijay.platform.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())){
            throw new UsernameAlreadyExistsException();
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException();
        }
        Role userRole=roleRepository.findByName("ROLE_USER")
                .orElseThrow(()->new IllegalArgumentException("Default role is not found"));
        User user=new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        user.getRoles().add(userRole);
        return userRepository.save(user);
    }
}
