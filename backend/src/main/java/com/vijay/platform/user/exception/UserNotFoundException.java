package com.vijay.platform.user.exception;

import com.vijay.platform.common.exception.BusinessException;
import com.vijay.platform.common.exception.ErrorCode;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(Long id) {
        super("user not found!!", ErrorCode.USER_NOT_FOUND);
    }
}
