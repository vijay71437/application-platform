package com.vijay.platform.finance.category.dto;

import com.vijay.platform.finance.category.entity.FinanceCategoryType;

import java.time.LocalDateTime;

public record FinanceCategoryResponse(
        Long id,
        String name,
        FinanceCategoryType categoryType,
        String description,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}