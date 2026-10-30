package com.vijay.platform.finance.recurring.dto;

import com.vijay.platform.finance.recurring.entity.RecurringOccurrenceStatus;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RecurringOccurrenceResponse(
        Long id,
        Long recurringTransactionId,
        LocalDate occurrenceDate,
        Long accountId,
        String accountName,
        Long categoryId,
        String categoryName,
        FinanceTransactionType transactionType,
        BigDecimal amount,
        String description,
        RecurringOccurrenceStatus status,
        Long transactionId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}