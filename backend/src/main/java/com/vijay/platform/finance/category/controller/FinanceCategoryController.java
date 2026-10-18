package com.vijay.platform.finance.category.controller;

import com.vijay.platform.common.config.ApiConstants;
import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.finance.category.dto.CreateFinanceCategoryRequest;
import com.vijay.platform.finance.category.dto.FinanceCategoryResponse;
import com.vijay.platform.finance.category.service.FinanceCategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiConstants.API_V1 + "/finance/categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class FinanceCategoryController {

    private final FinanceCategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<FinanceCategoryResponse> createCategory(
            @Valid @RequestBody CreateFinanceCategoryRequest request,
            Authentication authentication) {

        return ApiResponse.success(
                "Finance category created successfully",
                categoryService.createCategory(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping
    public ApiResponse<List<FinanceCategoryResponse>> getMyCategories(
            Authentication authentication) {

        return ApiResponse.success(
                "Finance categories retrieved successfully",
                categoryService.getMyCategories(authentication.getName())
        );
    }
}