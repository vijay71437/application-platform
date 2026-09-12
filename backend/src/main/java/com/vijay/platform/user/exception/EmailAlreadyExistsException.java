package com.vijay.platform.user.exception;

import com.vijay.platform.common.exception.BusinessException;

public class EmailAlreadyExistsException extends BusinessException {

    public EmailAlreadyExistsException() {
        super("Email already exists");
    }
}