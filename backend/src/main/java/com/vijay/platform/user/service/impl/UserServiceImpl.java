package com.vijay.platform.user.service.impl;

import com.vijay.platform.audit.AuditAction;
import com.vijay.platform.audit.service.AuditService;
import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.authorization.dto.AssignRolesRequest;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.authorization.repository.RoleRepository;
import com.vijay.platform.common.exception.InvalidResourceReferenceException;
import com.vijay.platform.common.response.PageResponse;
import com.vijay.platform.common.response.PaginationRequest;
import com.vijay.platform.security.service.RefreshTokenService;
import com.vijay.platform.user.dto.CreateUserRequest;
import com.vijay.platform.user.dto.UpdateUserRequest;
import com.vijay.platform.user.dto.UserResponse;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.exception.EmailAlreadyExistsException;
import com.vijay.platform.user.exception.UserNotFoundException;
import com.vijay.platform.user.exception.UsernameAlreadyExistsException;
import com.vijay.platform.user.repository.UserRepository;
import com.vijay.platform.user.service.UserCreationService;
import com.vijay.platform.user.specification.UserSpecification;
import com.vijay.platform.user.utils.UserSortFields;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserServiceImpl  {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private RefreshTokenService refreshTokenService;
    private final UserCreationService userCreationService;
    private final AuditService auditService;

    public UserResponse createUser(CreateUserRequest request) {

        User user = userCreationService.create(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName()
        );

        return toUserResponse(user);
    }

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

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(PaginationRequest paginationRequest, String search) {
        String sortField =
                UserSortFields.validate(
                        paginationRequest.getSortBy()
                );
        Sort.Direction direction=paginationRequest.getSortDirection();
        Pageable pageable= PageRequest.of(paginationRequest.getPage(), paginationRequest.getSize(),Sort.by(direction,sortField));
        var specification= UserSpecification.isEnabled();
        if(search !=null && !search.isBlank()){
             specification = specification.and(UserSpecification.search(search.trim()));
        }

        Page<User> userPage=userRepository.findAll(specification,pageable);

        return PageResponse.<UserResponse>builder().content(userPage.getContent().stream().map(this::toUserResponse).toList())
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();
    }

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return toUserResponse(user);
    }
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {

            throw new EmailAlreadyExistsException();
        }

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User updatedUser = userRepository.save(user);
        auditService.log(
                updatedUser,
                AuditAction.USER_UPDATED,
                "USER",
                updatedUser.getId().toString(),
                "User profile updated"
        );

        return toUserResponse(updatedUser);
    }

    public UserResponse deactivateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setEnabled(false);

        User updatedUser = userRepository.save(user);
        refreshTokenService.revokeAllUserTokens(
                user.getId()
        );
        auditService.log(
                updatedUser,
                AuditAction.USER_DEACTIVATED,
                "USER",
                updatedUser.getId().toString(),
                "User deactivated"
        );

        return toUserResponse(updatedUser);
    }

    @Transactional
    public UserResponse assignRoles(
            Long userId,
            AssignRolesRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(userId));

        Set<Role> roles = new HashSet<>(
                roleRepository.findAllByIdIn(request.getRoleIds())
        );

        if (roles.size() != request.getRoleIds().size()) {
            throw new InvalidResourceReferenceException(
                    "One or more role ids are invalid"
            );
        }

        user.setRoles(roles);

        User updatedUser = userRepository.save(user);
        auditService.log(
                updatedUser,
                AuditAction.USER_UPDATED,
                "USER",
                updatedUser.getId().toString(),
                "User roles are updated"
        );

        return toUserResponse(updatedUser);
    }

    private UserResponse toUserResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.isEnabled())
                .accountLocked(user.isAccountLocked())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
