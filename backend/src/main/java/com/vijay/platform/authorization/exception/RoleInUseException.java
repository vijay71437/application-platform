package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class RoleInUseException extends BusinessException {

    public RoleInUseException() {
        super(
                "Role cannot be deleted because it is assigned to users",
                ErrorCode.ROLE_IN_USE
        );
    }
}