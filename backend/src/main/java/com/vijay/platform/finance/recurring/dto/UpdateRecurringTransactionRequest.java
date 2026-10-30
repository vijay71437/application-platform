package com.vijay.platform.finance.recurring.dto;

import com.vijay.platform.finance.recurring.entity.RecurringFrequency;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateRecurringTransactionRequest(

        @NotNull
        Long accountId,

        @NotNull
        Long categoryId,

        @NotNull
        FinanceTransactionType transactionType,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @Size(max = 255)
        String description,

        @NotNull
        RecurringFrequency frequency,

        @NotNull
        LocalDate startDate,

        LocalDate endDate
) {
}