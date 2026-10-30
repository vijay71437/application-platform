
package com.vijay.platform.finance.recurring.controller;

import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.finance.recurring.dto.CreateRecurringTransactionRequest;
import com.vijay.platform.finance.recurring.dto.RecurringTransactionResponse;
import com.vijay.platform.finance.recurring.dto.UpdateRecurringTransactionRequest;
import com.vijay.platform.finance.recurring.service.RecurringTransactionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/recurring-transactions")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionController(
            RecurringTransactionService recurringTransactionService
    ) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> create(
            @Valid @RequestBody CreateRecurringTransactionRequest request
    ) {
        RecurringTransactionResponse response =
                recurringTransactionService.createRecurringTransaction(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Recurring transaction created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecurringTransactionResponse>>> getAll() {
        List<RecurringTransactionResponse> response =
                recurringTransactionService.getRecurringTransactions();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring transactions retrieved successfully",
                        response
                )
        );
    }


    @PatchMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> pause(
            @PathVariable Long id
    ) {
        RecurringTransactionResponse response =
                recurringTransactionService.pauseRecurringTransaction(id);

        return ResponseEntity.ok(
                ApiResponse.success("Recurring transaction paused successfully", response)
        );
    }

    @PatchMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> resume(
            @PathVariable Long id
    ) {
        RecurringTransactionResponse response =
                recurringTransactionService.resumeRecurringTransaction(id);

        return ResponseEntity.ok(
                ApiResponse.success("Recurring transaction resumed successfully", response)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecurringTransactionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecurringTransactionRequest request
    ) {
        RecurringTransactionResponse response =
                recurringTransactionService.updateRecurringTransaction(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring transaction updated successfully",
                        response
                )
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @PathVariable Long id
    ) {
        recurringTransactionService.deactivateRecurringTransaction(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring transaction deactivated successfully",
                        null
                )
        );
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RecurringTransactionResponse>>> getActive() {
        List<RecurringTransactionResponse> response =
                recurringTransactionService.getActiveRecurringTransactions();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Active recurring transactions retrieved successfully",
                        response
                )
        );
    }

}
