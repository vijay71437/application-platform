CREATE TABLE finance_categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_type VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_finance_categories_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_finance_categories_type
        CHECK (category_type IN ('INCOME', 'EXPENSE'))
);

CREATE UNIQUE INDEX uq_finance_categories_user_name_type
    ON finance_categories (user_id, LOWER(name), category_type);

CREATE INDEX idx_finance_categories_user_active
    ON finance_categories (user_id, active);