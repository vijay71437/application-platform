package com.vijay.platform.authentication.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class InvalidCurrentPasswordException
        extends BusinessException {

    public InvalidCurrentPasswordException() {
        super(
                "Current password is incorrect",
                ErrorCode.INVALID_CURRENT_PASSWORD
        );
    }
}