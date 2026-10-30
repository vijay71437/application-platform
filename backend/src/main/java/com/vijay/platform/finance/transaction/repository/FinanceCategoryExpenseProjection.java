
package com.vijay.platform.finance.transaction.repository;

import java.math.BigDecimal;

public interface FinanceCategoryExpenseProjection {
    Long getCategoryId();
    String getCategoryName();
    BigDecimal getTotalAmount();
    Long getTransactionCount();
}
