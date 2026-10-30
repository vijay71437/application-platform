
CREATE TABLE financial_transactions (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    transaction_type VARCHAR(20) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    description VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_financial_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_financial_transactions_account
        FOREIGN KEY (account_id)
        REFERENCES finance_accounts(id),

    CONSTRAINT fk_financial_transactions_category
        FOREIGN KEY (category_id)
        REFERENCES finance_categories(id),

    CONSTRAINT chk_financial_transactions_type
        CHECK (transaction_type IN ('INCOME', 'EXPENSE')),

    CONSTRAINT chk_financial_transactions_amount
        CHECK (amount > 0)
);

CREATE INDEX idx_financial_transactions_user_date
    ON financial_transactions (user_id, transaction_date DESC);

CREATE INDEX idx_financial_transactions_account_date
    ON financial_transactions (account_id, transaction_date DESC);

CREATE INDEX idx_financial_transactions_category
    ON financial_transactions (category_id);
