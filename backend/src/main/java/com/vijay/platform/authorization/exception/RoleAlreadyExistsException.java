package com.vijay.platform.authorization.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class RoleAlreadyExistsException extends BusinessException {
    public RoleAlreadyExistsException(String  name){
        super("Role is already with name:"+name, ErrorCode.ROLE_ALREADY_EXISTS);
    }
}
