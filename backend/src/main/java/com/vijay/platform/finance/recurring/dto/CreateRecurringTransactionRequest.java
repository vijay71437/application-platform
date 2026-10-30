
package com.vijay.platform.finance.recurring.dto;

import com.vijay.platform.finance.recurring.entity.RecurringFrequency;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateRecurringTransactionRequest(

        @NotNull(message = "Account ID is required")
        Long accountId,

        @NotNull(message = "Category ID is required")
        Long categoryId,

        @NotNull(message = "Transaction type is required")
        FinanceTransactionType transactionType,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @Size(max = 255, message = "Description cannot exceed 255 characters")
        String description,

        @NotNull(message = "Frequency is required")
        RecurringFrequency frequency,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        LocalDate endDate
) {
}
