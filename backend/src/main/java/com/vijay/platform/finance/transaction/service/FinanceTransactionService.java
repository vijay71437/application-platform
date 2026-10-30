
package com.vijay.platform.finance.transaction.service;

import com.vijay.platform.finance.account.entity.FinanceAccount;
import com.vijay.platform.finance.account.repository.FinanceAccountRepository;
import com.vijay.platform.finance.category.entity.FinanceCategory;
import com.vijay.platform.finance.category.entity.FinanceCategoryType;
import com.vijay.platform.finance.category.repository.FinanceCategoryRepository;
import com.vijay.platform.finance.transaction.dto.*;
import com.vijay.platform.finance.transaction.entity.FinanceTransaction;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import com.vijay.platform.finance.transaction.exception.FinanceResourceAccessException;
import com.vijay.platform.finance.transaction.exception.FinanceResourceNotFoundException;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionNotFoundException;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionValidationException;
import com.vijay.platform.finance.transaction.repository.FinanceCategoryExpenseProjection;
import com.vijay.platform.finance.transaction.repository.FinanceMonthlySummaryProjection;
import com.vijay.platform.finance.transaction.repository.FinanceTransactionRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vijay.platform.finance.transaction.repository.FinanceTransactionSpecification;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

import java.util.List;

@Service
public class FinanceTransactionService {

    private final FinanceTransactionRepository transactionRepository;
    private final FinanceAccountRepository accountRepository;
    private final FinanceCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public FinanceTransactionService(
            FinanceTransactionRepository transactionRepository,
            FinanceAccountRepository accountRepository,
            FinanceCategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FinanceTransactionResponse createTransaction(
            CreateFinanceTransactionRequest request
    ) {
        User user = getCurrentUser();

        FinanceAccount account = accountRepository
                .findById(request.accountId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException("Finance account not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new FinanceResourceAccessException();
        }

        if (!account.isActive()) {
            throw new FinanceTransactionValidationException(
                    "Cannot create a transaction for an inactive account");
        }

        FinanceCategory category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException("Finance category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You do not have access to this finance category");
        }

        if (!category.isActive()) {
            throw new FinanceTransactionValidationException(
                    "Cannot use an inactive finance category");
        }

        FinanceCategoryType expectedCategoryType =
                request.transactionType() == FinanceTransactionType.INCOME
                        ? FinanceCategoryType.INCOME
                        : FinanceCategoryType.EXPENSE;

        if (category.getCategoryType() != expectedCategoryType) {
            throw new FinanceTransactionValidationException("Category type must match the transaction type");
        }

        FinanceTransaction transaction = new FinanceTransaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setTransactionType(request.transactionType());
        transaction.setAmount(request.amount());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setDescription(request.description());

        FinanceTransaction saved =
                transactionRepository.save(transaction);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FinanceTransactionResponse> getTransactions() {
        User user = getCurrentUser();

        return transactionRepository
                .findAllByUserIdOrderByTransactionDateDescIdDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FinanceTransactionResponse getTransactionById(Long transactionId) {
        User user = getCurrentUser();

        FinanceTransaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(() ->
                        new FinanceTransactionNotFoundException());

        return toResponse(transaction);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new AccessDeniedException("User don't have permission"));
    }

    @Transactional(readOnly = true)
    public List<FinanceTransactionResponse> getFilteredTransactions(
            FinanceTransactionFilterRequest filter
    ) {
        if (filter.startDate() != null
                && filter.endDate() != null
                && filter.startDate().isAfter(filter.endDate())) {
            throw new FinanceTransactionValidationException(
                    "Start date cannot be after end date"
            );
        }

        User user = getCurrentUser();

        return transactionRepository.findAll(
                        FinanceTransactionSpecification.withFilters(
                                user.getId(),
                                filter
                        )
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Transactional
    public FinanceTransactionResponse updateTransaction(
            Long transactionId,
            UpdateFinanceTransactionRequest request
    ) {
        User user = getCurrentUser();

        FinanceTransaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(FinanceTransactionNotFoundException::new);

        FinanceAccount account = accountRepository
                .findById(request.accountId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException(
                                "Finance account not found"
                        ));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new FinanceResourceAccessException();
        }

        if (!account.isActive()) {
            throw new FinanceTransactionValidationException(
                    "Cannot use an inactive finance account"
            );
        }

        FinanceCategory category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException(
                                "Finance category not found"
                        ));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new FinanceResourceAccessException();
        }

        if (!category.isActive()) {
            throw new FinanceTransactionValidationException(
                    "Cannot use an inactive finance category"
            );
        }

        FinanceCategoryType expectedCategoryType =
                request.transactionType() == FinanceTransactionType.INCOME
                        ? FinanceCategoryType.INCOME
                        : FinanceCategoryType.EXPENSE;

        if (category.getCategoryType() != expectedCategoryType) {
            throw new FinanceTransactionValidationException(
                    "Category type must match the transaction type"
            );
        }

        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setTransactionType(request.transactionType());
        transaction.setAmount(request.amount());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setDescription(request.description());

        FinanceTransaction saved = transactionRepository.save(transaction);

        return toResponse(saved);
    }


    @Transactional
    public void deleteTransaction(Long transactionId) {
        User user = getCurrentUser();

        FinanceTransaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(FinanceTransactionNotFoundException::new);

        transactionRepository.delete(transaction);
    }


    @Transactional(readOnly = true)
    public FinanceMonthlySummaryResponse getMonthlySummary(
            int year,
            int month
    ) {
        if (month < 1 || month > 12) {
            throw new FinanceTransactionValidationException(
                    "Month must be between 1 and 12"
            );
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(
                startDate.lengthOfMonth()
        );

        User user = getCurrentUser();

        FinanceMonthlySummaryProjection summary =
                transactionRepository.summarizeByUserAndDateRange(
                        user.getId(),
                        startDate,
                        endDate
                );

        BigDecimal income = summary.getTotalIncome() != null
                ? summary.getTotalIncome() : BigDecimal.ZERO;
        BigDecimal expenses = summary.getTotalExpenses() != null
                ? summary.getTotalExpenses() : BigDecimal.ZERO;

        return new FinanceMonthlySummaryResponse(
                startDate,
                endDate,
                income,
                expenses,
                income.subtract(expenses),
                summary.getIncomeTransactionCount() != null
                        ? summary.getIncomeTransactionCount() : 0L,
                summary.getExpenseTransactionCount() != null
                        ? summary.getExpenseTransactionCount() : 0L
        );
    }


    @Transactional(readOnly = true)
    public List<FinanceCategoryExpenseResponse> getCategoryExpenseBreakdown(
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

        List<FinanceCategoryExpenseProjection> rows =
                transactionRepository.getCategoryExpenseBreakdown(
                        user.getId(),
                        startDate,
                        endDate
                );

        BigDecimal totalExpenses = rows.stream()
                .map(FinanceCategoryExpenseProjection::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return rows.stream()
                .map(row -> {
                    BigDecimal percentage = totalExpenses.signum() == 0
                            ? BigDecimal.ZERO
                            : row.getTotalAmount()
                            .multiply(BigDecimal.valueOf(100))
                            .divide(totalExpenses, 2, RoundingMode.HALF_UP);

                    return new FinanceCategoryExpenseResponse(
                            row.getCategoryId(),
                            row.getCategoryName(),
                            row.getTotalAmount(),
                            row.getTransactionCount(),
                            percentage
                    );
                })
                .toList();
    }


    @Transactional(readOnly = true)
    public Page<FinanceTransactionResponse> getTransactions(
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        if (page < 0) {
            throw new FinanceTransactionValidationException(
                    "Page number cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new FinanceTransactionValidationException(
                    "Page size must be between 1 and 100"
            );
        }

        if (!List.of("transactionDate", "amount", "createdAt")
                .contains(sortBy)) {
            throw new FinanceTransactionValidationException(
                    "Unsupported sort field"
            );
        }

        Sort.Direction sortDirection;
        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException ex) {
            throw new FinanceTransactionValidationException(
                    "Sort direction must be ASC or DESC"
            );
        }

        User user = getCurrentUser();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy).and(
                        Sort.by(Sort.Direction.DESC, "id")
                )
        );

        return transactionRepository
                .findAll(
                        FinanceTransactionSpecification.withFilters(
                                user.getId(),
                                new FinanceTransactionFilterRequest(
                                        null, null, null, null, null
                                )
                        ),
                        pageable
                )
                .map(this::toResponse);
    }





    private FinanceTransactionResponse toResponse(
            FinanceTransaction transaction
    ) {
        return new FinanceTransactionResponse(
                transaction.getId(),
                transaction.getAccount().getId(),
                transaction.getAccount().getName(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getTransactionType(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getDescription(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}
