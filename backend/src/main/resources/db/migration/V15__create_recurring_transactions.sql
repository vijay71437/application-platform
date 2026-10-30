
CREATE TABLE recurring_transactions (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    transaction_type VARCHAR(20) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    description VARCHAR(255),

    frequency VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence_date DATE NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recurring_transactions_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT fk_recurring_transactions_account
        FOREIGN KEY (account_id) REFERENCES finance_accounts(id),

    CONSTRAINT fk_recurring_transactions_category
        FOREIGN KEY (category_id) REFERENCES finance_categories(id),

    CONSTRAINT chk_recurring_transaction_type
        CHECK (transaction_type IN ('INCOME', 'EXPENSE')),

    CONSTRAINT chk_recurring_transaction_amount
        CHECK (amount > 0),

    CONSTRAINT chk_recurring_transaction_frequency
        CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),

    CONSTRAINT chk_recurring_transaction_dates
        CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_recurring_transactions_user_active
    ON recurring_transactions (user_id, active);

CREATE INDEX idx_recurring_transactions_next_occurrence
    ON recurring_transactions (next_occurrence_date)
    WHERE active = TRUE;
