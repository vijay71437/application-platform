
package com.vijay.platform.finance.transaction.dto;

import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateFinanceTransactionRequest(

        @NotNull(message = "Account ID is required")
        Long accountId,

        @NotNull(message = "Category ID is required")
        Long categoryId,

        @NotNull(message = "Transaction type is required")
        FinanceTransactionType transactionType,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotNull(message = "Transaction date is required")
        LocalDate transactionDate,

        @Size(max = 255, message = "Description cannot exceed 255 characters")
        String description
) {
}
