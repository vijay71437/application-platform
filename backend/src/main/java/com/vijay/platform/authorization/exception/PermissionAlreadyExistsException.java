package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class PermissionAlreadyExistsException extends BusinessException {

    public PermissionAlreadyExistsException(String name) {
        super(
                "Permission already exists: " + name,
                ErrorCode.PERMISSION_ALREADY_EXISTS
        );
    }
}