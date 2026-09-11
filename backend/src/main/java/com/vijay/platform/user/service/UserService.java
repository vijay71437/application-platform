package com.vijay.platform.user.service;

import com.vijay.platform.authentication.dto.RegisterRequest;
import com.vijay.platform.user.entity.User;

public interface UserService {
    public User register(RegisterRequest request);
}
