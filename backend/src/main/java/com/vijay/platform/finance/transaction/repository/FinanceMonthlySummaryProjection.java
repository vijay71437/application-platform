package com.vijay.platform.finance.transaction.repository;

import java.math.BigDecimal;

public interface FinanceMonthlySummaryProjection {
    BigDecimal getTotalIncome();
    BigDecimal getTotalExpenses();
    Long getIncomeTransactionCount();
    Long getExpenseTransactionCount();
}