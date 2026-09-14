package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class RoleNotFoundException extends BusinessException {
    public RoleNotFoundException(Long id) {
        super("Role is not found with id: "+id, ErrorCode.ROLE_NOT_FOUND);
    }
}
