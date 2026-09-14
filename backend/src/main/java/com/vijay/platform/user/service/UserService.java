package com.vijay.platform.user.service;

import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.authorization.dto.AssignRolesRequest;
import com.vijay.platform.authorization.entity.Role;
import com.vijay.platform.user.dto.UpdateUserRequest;
import com.vijay.platform.user.dto.UserResponse;
import com.vijay.platform.user.entity.User;

import java.util.List;
import java.util.Set;

public interface UserService {
    public User register(RegisterRequest request);

    public List<UserResponse> getAllUsers();
    public UserResponse getUserById(Long id);
    public UserResponse updateUser(Long id, UpdateUserRequest request);
    public UserResponse deactivateUser(Long id);
    public UserResponse assignRoles(Long id, AssignRolesRequest request);
}
