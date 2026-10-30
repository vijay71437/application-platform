
package com.vijay.platform.finance.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FinanceMonthlySummaryResponse(
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netCashFlow,
        long incomeTransactionCount,
        long expenseTransactionCount
) {
}
