package com.vijay.platform.finance.account.dto;

import com.vijay.platform.finance.account.entity.FinanceAccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FinanceAccountResponse(
        Long id,
        String name,
        FinanceAccountType accountType,
        String institutionName,
        String currency,
        BigDecimal openingBalance,
        BigDecimal creditLimit,
        String lastFourDigits,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}