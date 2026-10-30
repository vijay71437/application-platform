
package com.vijay.platform.finance.transaction.dto;

import java.math.BigDecimal;

public record FinanceCategoryExpenseResponse(
        Long categoryId,
        String categoryName,
        BigDecimal totalAmount,
        long transactionCount,
        BigDecimal percentage
) {
}
