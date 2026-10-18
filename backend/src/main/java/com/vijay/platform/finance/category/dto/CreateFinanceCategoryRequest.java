package com.vijay.platform.finance.category.dto;

import com.vijay.platform.finance.category.entity.FinanceCategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFinanceCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "Category type is required")
    private FinanceCategoryType categoryType;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}