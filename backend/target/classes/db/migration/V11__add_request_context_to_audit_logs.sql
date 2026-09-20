ALTER TABLE audit_logs
ADD COLUMN request_id VARCHAR(100);

ALTER TABLE audit_logs
ADD COLUMN user_agent TEXT;

CREATE INDEX idx_audit_logs_request_id
    ON audit_logs(request_id);