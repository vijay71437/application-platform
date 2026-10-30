
package com.vijay.platform.finance.transaction.controller;

import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.finance.transaction.dto.*;
import com.vijay.platform.finance.transaction.service.FinanceTransactionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/transactions")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class FinanceTransactionController {

    private final FinanceTransactionService transactionService;

    public FinanceTransactionController(
            FinanceTransactionService transactionService
    ) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FinanceTransactionResponse>> createTransaction(
            @Valid @RequestBody CreateFinanceTransactionRequest request
    ) {
        FinanceTransactionResponse response =
                transactionService.createTransaction(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Transaction created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinanceTransactionResponse>>> getTransactions() {
        List<FinanceTransactionResponse> response =
                transactionService.getTransactions();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transactions retrieved successfully",
                        response
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FinanceTransactionResponse>> getTransactionById(
            @PathVariable Long id
    ) {
        FinanceTransactionResponse response =
                transactionService.getTransactionById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transaction retrieved successfully",
                        response
                )
        );
    }


    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FinanceTransactionResponse>>> getFilteredTransactions(
            @ModelAttribute FinanceTransactionFilterRequest filter
    ) {
        List<FinanceTransactionResponse> response =
                transactionService.getFilteredTransactions(filter);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Filtered transactions retrieved successfully",
                        response
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinanceTransactionResponse>> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFinanceTransactionRequest request
    ) {
        FinanceTransactionResponse response =
                transactionService.updateTransaction(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transaction updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @PathVariable Long id
    ) {
        transactionService.deleteTransaction(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transaction deleted successfully",
                        null
                )
        );
    }



    @GetMapping("/summary/monthly")
    public ResponseEntity<ApiResponse<FinanceMonthlySummaryResponse>> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month
    ) {
        FinanceMonthlySummaryResponse response =
                transactionService.getMonthlySummary(year, month);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Monthly summary retrieved successfully",
                        response
                )
        );
    }


    @GetMapping("/summary/categories")
    public ResponseEntity<ApiResponse<List<FinanceCategoryExpenseResponse>>>
    getCategoryExpenseBreakdown(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        List<FinanceCategoryExpenseResponse> response =
                transactionService.getCategoryExpenseBreakdown(
                        startDate,
                        endDate
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category expense breakdown retrieved successfully",
                        response
                )
        );
    }


    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<FinanceTransactionResponse>>> getTransactionsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Page<FinanceTransactionResponse> response =
                transactionService.getTransactions(
                        page, size, sortBy, direction
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transactions retrieved successfully",
                        response
                )
        );
    }




}
