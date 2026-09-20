package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class PermissionNotFoundException extends BusinessException {

    public PermissionNotFoundException(Long id) {
        super(
                "Permission not found with id: " + id,
                ErrorCode.PERMISSION_NOT_FOUND
        );
    }
}