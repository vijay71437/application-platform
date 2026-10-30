
package com.vijay.platform.finance.transaction.exception;

import com.vijay.platform.common.exception.BusinessException;

public class FinanceTransactionValidationException extends BusinessException {

    public FinanceTransactionValidationException(String message) {
        super(message, "FINANCE_TRANSACTION_VALIDATION_FAILED");
    }
}
