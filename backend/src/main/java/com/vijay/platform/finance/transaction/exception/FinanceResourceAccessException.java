
package com.vijay.platform.finance.transaction.exception;

import com.vijay.platform.common.exception.BusinessException;

public class FinanceResourceAccessException extends BusinessException {

    public FinanceResourceAccessException() {
        super("You do not have access to this finance resource",
                "FINANCE_RESOURCE_ACCESS_DENIED");
    }
}
