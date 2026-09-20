package com.vijay.platform.user.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class EmailAlreadyExistsException extends BusinessException {

    public EmailAlreadyExistsException() {
        super("Email already exists", ErrorCode.EMAIL_ALREADY_EXISTS);
    }
}