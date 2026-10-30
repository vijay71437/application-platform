
package com.vijay.platform.finance.transaction.exception;

import com.vijay.platform.common.exception.BusinessException;

public class FinanceTransactionNotFoundException extends BusinessException {

    public FinanceTransactionNotFoundException() {
        super("Finance transaction not found", "FINANCE_TRANSACTION_NOT_FOUND");
    }
}
