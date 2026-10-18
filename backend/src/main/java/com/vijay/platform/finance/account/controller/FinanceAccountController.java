package com.vijay.platform.finance.account.controller;

import com.vijay.platform.common.config.ApiConstants;
import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.finance.account.dto.CreateFinanceAccountRequest;
import com.vijay.platform.finance.account.dto.FinanceAccountResponse;
import com.vijay.platform.finance.account.service.FinanceAccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping(ApiConstants.API_V1 + "/finance/accounts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class FinanceAccountController {

    private final FinanceAccountService financeAccountService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<FinanceAccountResponse> createAccount(
            @Valid @RequestBody CreateFinanceAccountRequest request,
            Authentication authentication) {

        return ApiResponse.success(
                "Finance account created successfully",
                financeAccountService.createAccount(
                        getUsername(authentication),
                        request
                )
        );
    }

    @GetMapping
    public ApiResponse<List<FinanceAccountResponse>> getMyAccounts(
            Authentication authentication) {

        return ApiResponse.success(
                "Finance accounts retrieved successfully",
                financeAccountService.getMyAccounts(
                        getUsername(authentication)
                )
        );
    }

    private String getUsername(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required"
            );
        }

        return authentication.getName();
    }
}