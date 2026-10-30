
package com.vijay.platform.finance.transaction.dto;

import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;

import java.time.LocalDate;

public record FinanceTransactionFilterRequest(
        LocalDate startDate,
        LocalDate endDate,
        Long accountId,
        Long categoryId,
        FinanceTransactionType transactionType
) {
}
