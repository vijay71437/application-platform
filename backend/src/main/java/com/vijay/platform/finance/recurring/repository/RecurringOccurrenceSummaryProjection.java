package com.vijay.platform.finance.recurring.repository;

import java.math.BigDecimal;

public interface RecurringOccurrenceSummaryProjection {

    Long getPendingCount();
    BigDecimal getPendingIncome();
    BigDecimal getPendingExpenses();

    Long getPostedCount();
    BigDecimal getPostedIncome();
    BigDecimal getPostedExpenses();

    Long getSkippedCount();
    BigDecimal getSkippedIncome();
    BigDecimal getSkippedExpenses();
}