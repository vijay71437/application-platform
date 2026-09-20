package com.vijay.platform.common.exception;

public class InvalidParameterException extends BusinessException {

    public InvalidParameterException(String message) {
        super(
                message,
                ErrorCode.INVALID_PARAMETER
        );
    }
}