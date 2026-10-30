package com.vijay.platform.finance.recurring.controller;

import com.vijay.platform.common.response.ApiResponse;
import com.vijay.platform.finance.recurring.dto.RecurringOccurrenceResponse;
import com.vijay.platform.finance.recurring.dto.RecurringOccurrenceSummaryResponse;
import com.vijay.platform.finance.recurring.service.RecurringOccurrenceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/recurring-occurrences")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class RecurringOccurrenceController {

    private final RecurringOccurrenceService occurrenceService;

    public RecurringOccurrenceController(
            RecurringOccurrenceService occurrenceService
    ) {
        this.occurrenceService = occurrenceService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Integer>> generate(
            @RequestParam
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate throughDate
    ) {
        int generatedCount =
                occurrenceService.generateOccurrencesThrough(throughDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring occurrences generated successfully",
                        generatedCount
                )
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<RecurringOccurrenceResponse>>>
    getPending() {
        List<RecurringOccurrenceResponse> occurrences =
                occurrenceService.getPendingOccurrences();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Pending recurring occurrences retrieved successfully",
                        occurrences
                )
        );
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<RecurringOccurrenceResponse>> confirm(
            @PathVariable Long id
    ) {
        RecurringOccurrenceResponse response =
                occurrenceService.confirmOccurrence(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring occurrence confirmed successfully",
                        response
                )
        );
    }


    @PatchMapping("/{id}/skip")
    public ResponseEntity<ApiResponse<RecurringOccurrenceResponse>> skip(
            @PathVariable Long id
    ) {
        RecurringOccurrenceResponse response =
                occurrenceService.skipOccurrence(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring occurrence skipped successfully",
                        response
                )
        );
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<RecurringOccurrenceResponse>>> getHistory(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        List<RecurringOccurrenceResponse> history =
                occurrenceService.getOccurrenceHistory(startDate, endDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring occurrence history retrieved successfully",
                        history
                )
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<RecurringOccurrenceSummaryResponse>>
    getSummary(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        RecurringOccurrenceSummaryResponse summary =
                occurrenceService.getOccurrenceSummary(startDate, endDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Recurring occurrence summary retrieved successfully",
                        summary
                )
        );
    }

}