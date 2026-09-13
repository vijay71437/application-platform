package com.vijay.platform.authentication.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class InvalidRefreshTokenException
        extends BusinessException {

    public InvalidRefreshTokenException() {
        super(
                "Invalid or expired refresh token",
                ErrorCode.INVALID_REFRESH_TOKEN
        );
    }
}