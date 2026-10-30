
package com.vijay.platform.finance.recurring.service;

import com.vijay.platform.finance.recurring.dto.RecurringOccurrenceResponse;
import com.vijay.platform.finance.recurring.dto.RecurringOccurrenceSummaryResponse;
import com.vijay.platform.finance.recurring.entity.RecurringOccurrenceStatus;
import com.vijay.platform.finance.recurring.entity.RecurringTransaction;
import com.vijay.platform.finance.recurring.entity.RecurringTransactionOccurrence;
import com.vijay.platform.finance.recurring.repository.RecurringOccurrenceSummaryProjection;
import com.vijay.platform.finance.recurring.repository.RecurringTransactionOccurrenceRepository;
import com.vijay.platform.finance.recurring.repository.RecurringTransactionRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.vijay.platform.finance.transaction.entity.FinanceTransaction;
import com.vijay.platform.finance.transaction.repository.FinanceTransactionRepository;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionNotFoundException;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionValidationException;

import java.time.LocalDate;
import java.util.List;

@Service
public class RecurringOccurrenceService {

    private final RecurringTransactionOccurrenceRepository occurrenceRepository;
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final UserRepository userRepository;
    private final FinanceTransactionRepository transactionRepository;

    public RecurringOccurrenceService(
            RecurringTransactionOccurrenceRepository occurrenceRepository,
            RecurringTransactionRepository recurringTransactionRepository,
            UserRepository userRepository,
            FinanceTransactionRepository transactionRepository
    ) {
        this.occurrenceRepository = occurrenceRepository;
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public int generateOccurrencesThrough(LocalDate throughDate) {
        if (throughDate == null) {
            throw new IllegalArgumentException("Through date is required");
        }

        User user = getCurrentUser();

        List<RecurringTransaction> schedules =
                recurringTransactionRepository.findActiveSchedulesForUpdate(
                        user.getId()
                );

        int generatedCount = 0;

        for (RecurringTransaction schedule : schedules) {
            LocalDate nextDate = schedule.getNextOccurrenceDate();

            while (!nextDate.isAfter(throughDate)) {
                LocalDate endDate = schedule.getEndDate();

                if (endDate != null && nextDate.isAfter(endDate)) {
                    schedule.setActive(false);
                    break;
                }

                if (!occurrenceRepository
                        .existsByRecurringTransactionIdAndOccurrenceDate(
                                schedule.getId(),
                                nextDate
                        )) {

                    RecurringTransactionOccurrence occurrence =
                            new RecurringTransactionOccurrence();

                    occurrence.setUser(user);
                    occurrence.setRecurringTransaction(schedule);
                    occurrence.setOccurrenceDate(nextDate);
                    occurrence.setAccount(schedule.getAccount());
                    occurrence.setCategory(schedule.getCategory());
                    occurrence.setTransactionType(schedule.getTransactionType());
                    occurrence.setAmount(schedule.getAmount());
                    occurrence.setDescription(schedule.getDescription());
                    occurrence.setStatus(RecurringOccurrenceStatus.PENDING);

                    occurrenceRepository.save(occurrence);
                    generatedCount++;
                }
                nextDate = RecurringDateCalculator.calculateNextOccurrence(
                        nextDate,
                        schedule.getStartDate(),
                        schedule.getFrequency()
                );
            }

            schedule.setNextOccurrenceDate(nextDate);

            if (schedule.getEndDate() != null
                    && nextDate.isAfter(schedule.getEndDate())) {
                schedule.setActive(false);
            }
        }

        return generatedCount;
    }


    @Transactional
    public RecurringOccurrenceResponse confirmOccurrence(Long occurrenceId) {
        User user = getCurrentUser();

        RecurringTransactionOccurrence occurrence =
                occurrenceRepository.findByIdAndUserIdForUpdate(
                        occurrenceId,
                        user.getId()
                ).orElseThrow(FinanceTransactionNotFoundException::new);

        // Repeated confirmation must never create another transaction.
        if (occurrence.getStatus() == RecurringOccurrenceStatus.POSTED) {
            return toResponse(occurrence);
        }

        if (occurrence.getStatus() != RecurringOccurrenceStatus.PENDING) {
            throw new FinanceTransactionValidationException(
                    "Only pending occurrences can be confirmed"
            );
        }

        RecurringTransaction schedule = occurrence.getRecurringTransaction();

        if (!schedule.getUser().getId().equals(user.getId())) {
            throw new FinanceTransactionValidationException(
                    "Recurring schedule ownership is invalid"
            );
        }

        FinanceTransaction transaction = new FinanceTransaction();
        transaction.setUser(user);
        transaction.setAccount(occurrence.getAccount());
        transaction.setCategory(occurrence.getCategory());
        transaction.setTransactionType(occurrence.getTransactionType());
        transaction.setAmount(occurrence.getAmount());
        transaction.setTransactionDate(occurrence.getOccurrenceDate());
        transaction.setDescription(occurrence.getDescription());

        FinanceTransaction savedTransaction =
                transactionRepository.save(transaction);

        occurrence.setTransaction(savedTransaction);
        occurrence.setStatus(RecurringOccurrenceStatus.POSTED);

        RecurringTransactionOccurrence savedOccurrence =
                occurrenceRepository.save(occurrence);

        return toResponse(savedOccurrence);
    }


    @Transactional
    public RecurringOccurrenceResponse skipOccurrence(Long occurrenceId) {
        User user = getCurrentUser();

        RecurringTransactionOccurrence occurrence =
                occurrenceRepository.findByIdAndUserIdForUpdate(
                        occurrenceId,
                        user.getId()
                ).orElseThrow(FinanceTransactionNotFoundException::new);

        if (occurrence.getStatus() != RecurringOccurrenceStatus.PENDING) {
            throw new FinanceTransactionValidationException(
                    "Only pending occurrences can be skipped"
            );
        }

        occurrence.setStatus(RecurringOccurrenceStatus.SKIPPED);

        RecurringTransactionOccurrence saved =
                occurrenceRepository.save(occurrence);

        return toResponse(saved);
    }



    @Transactional
    public List<RecurringOccurrenceResponse> getPendingOccurrences() {
        User user = getCurrentUser();

        return occurrenceRepository
                .findAllByUserIdAndStatusOrderByOccurrenceDateAsc(
                        user.getId(),
                        RecurringOccurrenceStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<RecurringOccurrenceResponse> getOccurrenceHistory(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new FinanceTransactionValidationException(
                    "Start date and end date are required"
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new FinanceTransactionValidationException(
                    "Start date cannot be after end date"
            );
        }

        User user = getCurrentUser();

        return occurrenceRepository
                .findAllByUserIdAndOccurrenceDateBetweenOrderByOccurrenceDateAsc(
                        user.getId(),
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecurringOccurrenceSummaryResponse getOccurrenceSummary(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null
                || startDate.isAfter(endDate)) {
            throw new FinanceTransactionValidationException(
                    "Provide a valid start date and end date"
            );
        }

        User user = getCurrentUser();

        RecurringOccurrenceSummaryProjection summary =
                occurrenceRepository.getOccurrenceSummary(
                        user.getId(),
                        startDate,
                        endDate
                );

        return new RecurringOccurrenceSummaryResponse(
                summary.getPendingCount(),
                summary.getPendingIncome(),
                summary.getPendingExpenses(),

                summary.getPostedCount(),
                summary.getPostedIncome(),
                summary.getPostedExpenses(),

                summary.getSkippedCount(),
                summary.getSkippedIncome(),
                summary.getSkippedExpenses()
        );
    }



    private RecurringOccurrenceResponse toResponse(
            RecurringTransactionOccurrence occurrence
    ) {
        return new RecurringOccurrenceResponse(
                occurrence.getId(),
                occurrence.getRecurringTransaction().getId(),
                occurrence.getOccurrenceDate(),
                occurrence.getAccount().getId(),
                occurrence.getAccount().getName(),
                occurrence.getCategory().getId(),
                occurrence.getCategory().getName(),
                occurrence.getTransactionType(),
                occurrence.getAmount(),
                occurrence.getDescription(),
                occurrence.getStatus(),
                occurrence.getTransaction() == null
                        ? null
                        : occurrence.getTransaction().getId(),
                occurrence.getCreatedAt(),
                occurrence.getUpdatedAt()
        );
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Authenticated user is required");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user was not found")
                );
    }
}
