package com.vijay.platform.common.exception;

public class InvalidResourceException extends BusinessException {

    public InvalidResourceException(String message) {
        super(
                message,
                ErrorCode.RESOURCE_NOT_FOUND
        );
    }
}