
package com.vijay.platform.finance.transaction.dto;

import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record FinanceTransactionResponse(
        Long id,
        Long accountId,
        String accountName,
        Long categoryId,
        String categoryName,
        FinanceTransactionType transactionType,
        BigDecimal amount,
        LocalDate transactionDate,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
