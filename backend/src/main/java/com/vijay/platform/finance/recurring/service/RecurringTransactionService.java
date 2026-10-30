
package com.vijay.platform.finance.recurring.service;

import com.vijay.platform.finance.account.entity.FinanceAccount;
import com.vijay.platform.finance.account.repository.FinanceAccountRepository;
import com.vijay.platform.finance.category.entity.FinanceCategory;
import com.vijay.platform.finance.category.entity.FinanceCategoryType;
import com.vijay.platform.finance.category.repository.FinanceCategoryRepository;
import com.vijay.platform.finance.recurring.dto.CreateRecurringTransactionRequest;
import com.vijay.platform.finance.recurring.dto.RecurringTransactionResponse;
import com.vijay.platform.finance.recurring.dto.UpdateRecurringTransactionRequest;
import com.vijay.platform.finance.recurring.entity.RecurringFrequency;
import com.vijay.platform.finance.recurring.entity.RecurringTransaction;
import com.vijay.platform.finance.recurring.repository.RecurringTransactionOccurrenceRepository;
import com.vijay.platform.finance.recurring.repository.RecurringTransactionRepository;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import com.vijay.platform.finance.transaction.exception.FinanceResourceAccessException;
import com.vijay.platform.finance.transaction.exception.FinanceResourceNotFoundException;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionNotFoundException;
import com.vijay.platform.finance.transaction.exception.FinanceTransactionValidationException;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringRepository;
    private final FinanceAccountRepository accountRepository;
    private final FinanceCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RecurringTransactionOccurrenceRepository recurringTransactionOccurrenceRepository;

    public RecurringTransactionService(
            RecurringTransactionRepository recurringRepository,
            FinanceAccountRepository accountRepository,
            FinanceCategoryRepository categoryRepository,
            UserRepository userRepository,
            RecurringTransactionOccurrenceRepository recurringTransactionOccurrenceRepository
    ) {
        this.recurringRepository = recurringRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.recurringTransactionOccurrenceRepository=recurringTransactionOccurrenceRepository;
    }

    @Transactional
    public RecurringTransactionResponse createRecurringTransaction(
            CreateRecurringTransactionRequest request
    ) {
        User user = getCurrentUser();

        if (request.endDate() != null
                && request.endDate().isBefore(request.startDate())) {
            throw new FinanceTransactionValidationException(
                    "End date cannot be before start date"
            );
        }

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

        RecurringTransaction recurring = new RecurringTransaction();
        recurring.setUser(user);
        recurring.setAccount(account);
        recurring.setCategory(category);
        recurring.setTransactionType(request.transactionType());
        recurring.setAmount(request.amount());
        recurring.setDescription(request.description());
        recurring.setFrequency(request.frequency());
        recurring.setStartDate(request.startDate());
        recurring.setEndDate(request.endDate());
        recurring.setNextOccurrenceDate(request.startDate());
        recurring.setActive(true);

        RecurringTransaction saved = recurringRepository.save(recurring);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<RecurringTransactionResponse> getRecurringTransactions() {
        User user = getCurrentUser();

        return recurringRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new FinanceTransactionValidationException(
                                "Authenticated user not found"
                        ));
    }


    public RecurringTransactionResponse pauseRecurringTransaction(Long id) {
        return updateRecurringStatus(id, false);
    }

    public RecurringTransactionResponse resumeRecurringTransaction(Long id) {
        return updateRecurringStatus(id, true);
    }

    private RecurringTransactionResponse updateRecurringStatus(
            Long id,
            boolean active
    ) {
        User user = getCurrentUser();

        RecurringTransaction recurringTransaction =
                recurringRepository.findByIdAndUserId(id, user.getId())
                        .orElseThrow(FinanceTransactionNotFoundException::new);

        if (active
                && recurringTransaction.getEndDate() != null
                && recurringTransaction.getNextOccurrenceDate()
                .isAfter(recurringTransaction.getEndDate())) {
            throw new FinanceTransactionValidationException(
                    "Cannot resume a recurring schedule that has ended"
            );
        }
        recurringTransaction.setActive(active);

        RecurringTransaction saved =
                recurringRepository.save(recurringTransaction);

        return toResponse(saved);
    }


    @Transactional
    public RecurringTransactionResponse updateRecurringTransaction(
            Long id,
            UpdateRecurringTransactionRequest request
    ) {
        User user = getCurrentUser();

        RecurringTransaction schedule =
                recurringRepository.findByIdAndUserId(id, user.getId())
                        .orElseThrow(FinanceTransactionNotFoundException::new);

        if (request.endDate() != null
                && request.endDate().isBefore(request.startDate())) {
            throw new FinanceTransactionValidationException(
                    "End date cannot be before start date"
            );
        }

        FinanceAccount account = accountRepository
                .findById(request.accountId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException(
                                "Finance account not found"
                        ));

        FinanceCategory category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() ->
                        new FinanceResourceNotFoundException(
                                "Finance category not found"
                        ));

        if (!account.getUser().getId().equals(user.getId())
                || !category.getUser().getId().equals(user.getId())) {
            throw new FinanceResourceAccessException();
        }

        if (!account.isActive() || !category.isActive()) {
            throw new FinanceTransactionValidationException(
                    "Account and category must be active"
            );
        }

        if (category.getCategoryType().name()
                .equals(request.transactionType().name()) == false) {
            throw new FinanceTransactionValidationException(
                    "Category type must match transaction type"
            );
        }

        boolean scheduleDefinitionChanged =
                !schedule.getFrequency().equals(request.frequency())
                        || !schedule.getStartDate().equals(request.startDate());

        if (scheduleDefinitionChanged
                && recurringTransactionOccurrenceRepository
                .existsByRecurringTransactionId(schedule.getId())) {
            throw new FinanceTransactionValidationException(
                    "Frequency or start date cannot be changed after occurrences "
                            + "have been generated"
            );
        }

        LocalDate nextOccurrence = scheduleDefinitionChanged
                ? request.startDate()
                : schedule.getNextOccurrenceDate();

        if (request.endDate() != null
                && nextOccurrence.isAfter(request.endDate())) {
            throw new FinanceTransactionValidationException(
                    "Next occurrence cannot be after the end date"
            );
        }

        if (nextOccurrence.isBefore(request.startDate())) {
            nextOccurrence = request.startDate();
        }

        if (request.endDate() != null
                && nextOccurrence.isAfter(request.endDate())) {
            throw new FinanceTransactionValidationException(
                    "Next occurrence cannot be after the end date"
            );
        }

        schedule.setAccount(account);
        schedule.setCategory(category);
        schedule.setTransactionType(request.transactionType());
        schedule.setAmount(request.amount());
        schedule.setDescription(request.description());
        schedule.setFrequency(request.frequency());
        schedule.setStartDate(request.startDate());
        schedule.setEndDate(request.endDate());
        schedule.setNextOccurrenceDate(nextOccurrence);

        RecurringTransaction saved =
                recurringRepository.save(schedule);

        return toResponse(saved);
    }


    @Transactional
    public void deactivateRecurringTransaction(Long id) {
        User user = getCurrentUser();

        RecurringTransaction schedule =
                recurringRepository.findByIdAndUserId(id, user.getId())
                        .orElseThrow(FinanceTransactionNotFoundException::new);

        if (!schedule.isActive()) {
            return;
        }

        schedule.setActive(false);
        recurringRepository.save(schedule);
    }

    public List<RecurringTransactionResponse> getActiveRecurringTransactions() {
        User user = getCurrentUser();

        return recurringRepository
                .findAllByUserIdAndActiveTrueOrderByNextOccurrenceDateAsc(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }




    private RecurringTransactionResponse toResponse(
            RecurringTransaction recurring
    ) {
        return new RecurringTransactionResponse(
                recurring.getId(),
                recurring.getAccount().getId(),
                recurring.getAccount().getName(),
                recurring.getCategory().getId(),
                recurring.getCategory().getName(),
                recurring.getTransactionType(),
                recurring.getAmount(),
                recurring.getDescription(),
                recurring.getFrequency(),
                recurring.getStartDate(),
                recurring.getEndDate(),
                recurring.getNextOccurrenceDate(),
                recurring.isActive(),
                recurring.getCreatedAt(),
                recurring.getUpdatedAt()
        );
    }
}
