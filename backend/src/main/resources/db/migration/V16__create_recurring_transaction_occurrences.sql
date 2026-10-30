
CREATE TABLE recurring_transaction_occurrences (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id),

    recurring_transaction_id BIGINT NOT NULL
        REFERENCES recurring_transactions(id),

    occurrence_date DATE NOT NULL,

    account_id BIGINT NOT NULL
        REFERENCES finance_accounts(id),

    category_id BIGINT NOT NULL
        REFERENCES finance_categories(id),

    transaction_type VARCHAR(20) NOT NULL
        CHECK (transaction_type IN ('INCOME', 'EXPENSE')),

    amount NUMERIC(19, 2) NOT NULL
        CHECK (amount > 0),

    description VARCHAR(255),

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'POSTED', 'SKIPPED')),

    transaction_id BIGINT UNIQUE
        REFERENCES financial_transactions(id),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_recurring_occurrence
        UNIQUE (recurring_transaction_id, occurrence_date),

    CONSTRAINT chk_posted_occurrence_has_transaction
        CHECK (status <> 'POSTED' OR transaction_id IS NOT NULL),

    CONSTRAINT chk_unposted_occurrence_has_no_transaction
        CHECK (status <> 'PENDING' OR transaction_id IS NULL)
);

CREATE INDEX idx_recurring_occurrences_user_date
    ON recurring_transaction_occurrences(user_id, occurrence_date DESC);

CREATE INDEX idx_recurring_occurrences_user_status
    ON recurring_transaction_occurrences(user_id, status);

CREATE INDEX idx_recurring_occurrences_pending_date
    ON recurring_transaction_occurrences(occurrence_date)
    WHERE status = 'PENDING';
