package com.vijay.platform.finance.recurring.dto;

import java.math.BigDecimal;

public record RecurringOccurrenceSummaryResponse(
        long pendingCount,
        BigDecimal pendingIncome,
        BigDecimal pendingExpenses,

        long postedCount,
        BigDecimal postedIncome,
        BigDecimal postedExpenses,

        long skippedCount,
        BigDecimal skippedIncome,
        BigDecimal skippedExpenses
) {
}