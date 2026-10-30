
package com.vijay.platform.finance.transaction.exception;

import com.vijay.platform.common.exception.BusinessException;

public class FinanceResourceNotFoundException extends BusinessException {

    public FinanceResourceNotFoundException(String message) {
        super(message, "FINANCE_RESOURCE_NOT_FOUND");
    }
}
