
package com.vijay.platform.finance.recurring.dto;

import com.vijay.platform.finance.recurring.entity.RecurringFrequency;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RecurringTransactionResponse(
        Long id,
        Long accountId,
        String accountName,
        Long categoryId,
        String categoryName,
        FinanceTransactionType transactionType,
        BigDecimal amount,
        String description,
        RecurringFrequency frequency,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate nextOccurrenceDate,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
