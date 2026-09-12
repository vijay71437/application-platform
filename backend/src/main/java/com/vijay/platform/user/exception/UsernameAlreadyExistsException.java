package com.vijay.platform.user.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class UsernameAlreadyExistsException extends BusinessException {

    public UsernameAlreadyExistsException() {
        super("Username already exists", ErrorCode.USERNAME_ALREADY_EXISTS);
    }
}