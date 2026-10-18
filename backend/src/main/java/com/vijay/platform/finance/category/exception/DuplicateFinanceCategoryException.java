package com.vijay.platform.finance.category.exception;

import com.vijay.platform.common.exception.ErrorCode;

public class DuplicateFinanceCategoryException extends RuntimeException {

    public DuplicateFinanceCategoryException() {
        super("A category with this name and type already exists");
    }

    public String getErrorCode() {
        return ErrorCode.FINANCE_CATEGORY_ALREADY_EXISTS;
    }
}