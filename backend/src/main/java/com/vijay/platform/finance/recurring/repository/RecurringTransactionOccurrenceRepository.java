package com.vijay.platform.finance.recurring.repository;

import com.vijay.platform.finance.recurring.entity.RecurringOccurrenceStatus;
import com.vijay.platform.finance.recurring.entity.RecurringTransactionOccurrence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecurringTransactionOccurrenceRepository
        extends JpaRepository<RecurringTransactionOccurrence, Long> {

    List<RecurringTransactionOccurrence>
    findAllByUserIdAndOccurrenceDateBetweenOrderByOccurrenceDateAsc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<RecurringTransactionOccurrence>
    findAllByUserIdAndStatusOrderByOccurrenceDateAsc(
            Long userId,
            RecurringOccurrenceStatus status
    );

    Optional<RecurringTransactionOccurrence> findByIdAndUserId(
            Long id,
            Long userId
    );

    Optional<RecurringTransactionOccurrence>
    findByRecurringTransactionIdAndOccurrenceDate(
            Long recurringTransactionId,
            LocalDate occurrenceDate
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT o
       FROM RecurringTransactionOccurrence o
       WHERE o.id = :id
         AND o.user.id = :userId
       """)
    Optional<RecurringTransactionOccurrence> findByIdAndUserIdForUpdate(
            @Param("id") Long id,
            @Param("userId") Long userId
    );

    boolean existsByRecurringTransactionIdAndOccurrenceDate(
            Long recurringTransactionId,
            LocalDate occurrenceDate
    );

    @Query(value = """
    SELECT
        COUNT(*) FILTER (WHERE status = 'PENDING') AS "pendingCount",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'PENDING' AND transaction_type = 'INCOME'
        ), 0) AS "pendingIncome",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'PENDING' AND transaction_type = 'EXPENSE'
        ), 0) AS "pendingExpenses",

        COUNT(*) FILTER (WHERE status = 'POSTED') AS "postedCount",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'POSTED' AND transaction_type = 'INCOME'
        ), 0) AS "postedIncome",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'POSTED' AND transaction_type = 'EXPENSE'
        ), 0) AS "postedExpenses",

        COUNT(*) FILTER (WHERE status = 'SKIPPED') AS "skippedCount",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'SKIPPED' AND transaction_type = 'INCOME'
        ), 0) AS "skippedIncome",
        COALESCE(SUM(amount) FILTER (
            WHERE status = 'SKIPPED' AND transaction_type = 'EXPENSE'
        ), 0) AS "skippedExpenses"

    FROM recurring_transaction_occurrences
    WHERE user_id = :userId
      AND occurrence_date BETWEEN :startDate AND :endDate
    """, nativeQuery = true)
    RecurringOccurrenceSummaryProjection getOccurrenceSummary(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );


    boolean existsByRecurringTransactionId(Long recurringTransactionId);
}