package com.vijay.platform.user.service;

import com.vijay.platform.audit.AuditAction;
import com.vijay.platform.audit.service.AuditService;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.authorization.repository.RoleRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.exception.EmailAlreadyExistsException;
import com.vijay.platform.user.exception.UsernameAlreadyExistsException;
import com.vijay.platform.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserCreationService {

    private static final String DEFAULT_ROLE = "ROLE_USER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserCreationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuditService auditService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService=auditService;
    }

    public User create(
            String username,
            String email,
            String password,
            String firstName,
            String lastName) {

        validateUniqueUser(username, email);

        Role defaultRole = roleRepository
                .findByName(DEFAULT_ROLE)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Default role not configured"
                        )
                );

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(password)
        );
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.getRoles().add(defaultRole);
        User savedUser=userRepository.save(user);
        auditService.log(
                savedUser,
                AuditAction.USER_CREATED,
                "USER",
                savedUser.getId().toString(),
                "User created by administrator"
        );
        return savedUser;
    }

    private void validateUniqueUser(
            String username,
            String email) {

        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException();
        }

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException();
        }
    }
}