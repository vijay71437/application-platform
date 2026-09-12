package com.vijay.platform.user.exception;

import com.vijay.platform.common.exception.BusinessException;

public class UsernameAlreadyExistsException extends BusinessException {

    public UsernameAlreadyExistsException() {
        super("Username already exists");
    }
}