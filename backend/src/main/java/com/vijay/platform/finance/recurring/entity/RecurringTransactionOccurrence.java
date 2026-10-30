package com.vijay.platform.finance.recurring.entity;

import com.vijay.platform.finance.account.entity.FinanceAccount;
import com.vijay.platform.finance.category.entity.FinanceCategory;
import com.vijay.platform.finance.transaction.entity.FinanceTransaction;
import com.vijay.platform.finance.transaction.entity.FinanceTransactionType;
import com.vijay.platform.user.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "recurring_transaction_occurrences",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_recurring_occurrence",
                        columnNames = {
                                "recurring_transaction_id",
                                "occurrence_date"
                        }
                )
        }
)
public class RecurringTransactionOccurrence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recurring_transaction_id", nullable = false)
    private RecurringTransaction recurringTransaction;

    @Column(name = "occurrence_date", nullable = false)
    private LocalDate occurrenceDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private FinanceAccount account;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private FinanceCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private FinanceTransactionType transactionType;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RecurringOccurrenceStatus status = RecurringOccurrenceStatus.PENDING;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", unique = true)
    private FinanceTransaction transaction;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public RecurringTransactionOccurrence() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public RecurringTransaction getRecurringTransaction() {
        return recurringTransaction;
    }

    public void setRecurringTransaction(RecurringTransaction recurringTransaction) {
        this.recurringTransaction = recurringTransaction;
    }

    public LocalDate getOccurrenceDate() {
        return occurrenceDate;
    }

    public void setOccurrenceDate(LocalDate occurrenceDate) {
        this.occurrenceDate = occurrenceDate;
    }

    public FinanceAccount getAccount() {
        return account;
    }

    public void setAccount(FinanceAccount account) {
        this.account = account;
    }

    public FinanceCategory getCategory() {
        return category;
    }

    public void setCategory(FinanceCategory category) {
        this.category = category;
    }

    public FinanceTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(FinanceTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RecurringOccurrenceStatus getStatus() {
        return status;
    }

    public void setStatus(RecurringOccurrenceStatus status) {
        this.status = status;
    }

    public FinanceTransaction getTransaction() {
        return transaction;
    }

    public void setTransaction(FinanceTransaction transaction) {
        this.transaction = transaction;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}