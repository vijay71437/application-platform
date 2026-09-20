package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class PermissionInUseException extends BusinessException {

    public PermissionInUseException() {
        super(
                "Permission cannot be deleted because it is assigned to roles",
                ErrorCode.PERMISSION_IN_USE
        );
    }
}