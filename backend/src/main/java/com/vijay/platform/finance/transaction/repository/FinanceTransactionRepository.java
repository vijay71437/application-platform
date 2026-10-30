
package com.vijay.platform.finance.transaction.repository;

import com.vijay.platform.finance.transaction.entity.FinanceTransaction;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface FinanceTransactionRepository
        extends JpaRepository<FinanceTransaction, Long> , JpaSpecificationExecutor<FinanceTransaction> {

    List<FinanceTransaction> findAllByUserIdOrderByTransactionDateDescIdDesc(
            Long userId
    );
    long deleteByIdAndUserId(Long id, Long userId);

    Optional<FinanceTransaction> findByIdAndUserId(
            Long id,
            Long userId
    );

    List<FinanceTransaction> findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinanceTransaction> findAllByUserIdAndAccountIdAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
            Long userId,
            Long accountId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinanceTransaction> findAllByUserIdAndCategoryIdAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
            Long userId,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<FinanceTransaction> findAllByUserIdAndTransactionTypeAndTransactionDateBetweenOrderByTransactionDateDescIdDesc(
            Long userId,
            FinanceTransactionType transactionType,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
    SELECT
        COALESCE(SUM(
            CASE WHEN t.transactionType = 'INCOME'
                 THEN t.amount ELSE 0 END
        ), 0) AS totalIncome,
        COALESCE(SUM(
            CASE WHEN t.transactionType = 'EXPENSE'
                 THEN t.amount ELSE 0 END
        ), 0) AS totalExpenses,
        SUM(CASE WHEN t.transactionType = 'INCOME'
                 THEN 1 ELSE 0 END) AS incomeTransactionCount,
        SUM(CASE WHEN t.transactionType = 'EXPENSE'
                 THEN 1 ELSE 0 END) AS expenseTransactionCount
    FROM FinanceTransaction t
    WHERE t.user.id = :userId
      AND t.transactionDate BETWEEN :startDate AND :endDate
    """)
    FinanceMonthlySummaryProjection summarizeByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );


    @Query("""
    SELECT
        t.category.id AS categoryId,
        t.category.name AS categoryName,
        SUM(t.amount) AS totalAmount,
        COUNT(t.id) AS transactionCount
    FROM FinanceTransaction t
    WHERE t.user.id = :userId
      AND t.transactionType = com.vijay.platform.finance.transaction.entity.FinanceTransactionType.EXPENSE
      AND t.transactionDate BETWEEN :startDate AND :endDate
    GROUP BY t.category.id, t.category.name
    ORDER BY SUM(t.amount) DESC
    """)
    List<FinanceCategoryExpenseProjection> getCategoryExpenseBreakdown(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );



}

