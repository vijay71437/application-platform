CREATE TABLE finance_accounts (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,

    account_type VARCHAR(30) NOT NULL,

    institution_name VARCHAR(150),

    currency VARCHAR(3) NOT NULL DEFAULT 'INR',

    opening_balance NUMERIC(19, 4) NOT NULL DEFAULT 0,

    credit_limit NUMERIC(19, 4),

    last_four_digits VARCHAR(4),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_finance_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_finance_accounts_type
        CHECK (
            account_type IN (
                'BANK_ACCOUNT',
                'CASH',
                'WALLET',
                'CREDIT_CARD'
            )
        ),

    CONSTRAINT chk_finance_accounts_currency
        CHECK (currency ~ '^[A-Z]{3}$'),

    CONSTRAINT chk_finance_accounts_opening_balance
        CHECK (opening_balance >= 0),

    CONSTRAINT chk_finance_accounts_credit_limit
        CHECK (credit_limit IS NULL OR credit_limit >= 0),

    CONSTRAINT chk_finance_accounts_last_four
        CHECK (
            last_four_digits IS NULL
            OR last_four_digits ~ '^[0-9]{4}$'
        )
);

CREATE INDEX idx_finance_accounts_user_id
    ON finance_accounts(user_id);

CREATE INDEX idx_finance_accounts_user_active
    ON finance_accounts(user_id, active);