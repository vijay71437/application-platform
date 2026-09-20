package com.vijay.platform.common.exception;

public class InvalidResourceReferenceException
        extends BusinessException {

    public InvalidResourceReferenceException(String message) {
        super(
                message,
                ErrorCode.INVALID_RESOURCE_REFERENCE
        );
    }
}