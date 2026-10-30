import { useState, useEffect } from "react";
import { Plus, Wallet, CreditCard, PiggyBank, TrendingUp, Banknote, RefreshCw } from "lucide-react";
import { getAccounts, createAccount } from "../../services/financeService";
import { getApiError } from "../../api/apiError";
import { useNotification } from "../../components/notifications/NotificationContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";

const ACCOUNT_TYPES = [
    { value: "SAVINGS", label: "Savings Account", icon: PiggyBank, color: "success" },
    { value: "CHECKING", label: "Checking Account", icon: Wallet, color: "info" },
    { value: "CREDIT", label: "Credit Card", icon: CreditCard, color: "danger" },
    { value: "INVESTMENT", label: "Investment", icon: TrendingUp, color: "purple" },
    { value: "CASH", label: "Cash / Wallet", icon: Banknote, color: "warning" },
];

function getAccountMeta(type) {
    return (
        ACCOUNT_TYPES.find((t) => t.value === type) || {
            value: type,
            label: type,
            icon: Wallet,
            color: "neutral",
        }
    );
}

function FinanceAccountsPage() {
    const notification = useNotification();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const [form, setForm] = useState({
        name: "",
        type: "SAVINGS",
        balance: "0",
        currency: "INR",
        description: "",
    });

    async function loadAccounts() {
        try {
            setLoading(true);
            const data = await getAccounts();
            setAccounts(data);
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to load accounts");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAccounts();
    }, []);

    function handleOpenModal() {
        setForm({
            name: "",
            type: "SAVINGS",
            balance: "0",
            currency: "INR",
            description: "",
        });
        setFormError("");
        setIsModalOpen(true);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) {
            setFormError("Account name is required.");
            return;
        }

        try {
            setSubmitting(true);
            await createAccount({
                name: form.name.trim(),
                type: form.type,
                balance: parseFloat(form.balance) || 0,
                currency: form.currency,
                description: form.description.trim() || null,
            });
            notification.success("Account created successfully!");
            setIsModalOpen(false);
            loadAccounts();
        } catch (err) {
            const apiError = getApiError(err);
            setFormError(apiError.message || "Failed to create account.");
        } finally {
            setSubmitting(false);
        }
    }

    const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);

    return (
        <div>
            <PageHeader
                title="Finance Accounts"
                description="Manage your bank accounts, credit cards, investments and cash reserves."
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={loadAccounts}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button variant="primary" icon={Plus} onClick={handleOpenModal}>
                            Add Account
                        </Button>
                    </div>
                }
            />

            {/* Overall Stats */}
            <div className="stats-grid" style={{ marginBottom: "24px" }}>
                <Card className="stat-card">
                    <div className="stat-label">Total Accounts</div>
                    <div className="stat-value">{accounts.length}</div>
                    <span className="stat-hint">Active financial ledgers</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Combined Balance</div>
                    <div className="stat-value" style={{ color: totalBalance >= 0 ? "#10b981" : "#ef4444" }}>
                        {formatCurrency(totalBalance)}
                    </div>
                    <span className="stat-hint">Across all connected accounts</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Primary Currency</div>
                    <div className="stat-value">INR (₹)</div>
                    <span className="stat-hint">Multi-currency supported</span>
                </Card>
            </div>

            {/* Accounts Grid */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <span>Loading your accounts...</span>
                </div>
            ) : accounts.length === 0 ? (
                <Card className="empty-state">
                    <Wallet size={48} className="empty-state-icon" />
                    <h3>No accounts found</h3>
                    <p>Create your first account to start tracking transactions, income, and expenses.</p>
                    <Button variant="primary" icon={Plus} onClick={handleOpenModal}>
                        Create Account
                    </Button>
                </Card>
            ) : (
                <div className="accounts-grid">
                    {accounts.map((acc) => {
                        const meta = getAccountMeta(acc.type);
                        const Icon = meta.icon;
                        const bal = Number(acc.balance) || 0;

                        return (
                            <Card key={acc.id} className="account-card">
                                <div className="account-card-header">
                                    <div className={`account-icon-badge account-icon-${meta.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <Badge variant={meta.color}>{meta.label}</Badge>
                                </div>

                                <div className="account-card-body">
                                    <h3 className="account-card-name">{acc.name}</h3>
                                    {acc.description && (
                                        <p className="account-card-desc">{acc.description}</p>
                                    )}
                                    <div className="account-card-balance">
                                        <span className="balance-label">Current Balance</span>
                                        <strong
                                            className="balance-amount"
                                            style={{ color: bal >= 0 ? "#0f172a" : "#ef4444" }}
                                        >
                                            {formatCurrency(bal, acc.currency)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="account-card-footer">
                                    <span className="text-muted">
                                        Opened {formatDate(acc.createdAt)}
                                    </span>
                                    <span className="account-currency-tag">{acc.currency || "INR"}</span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create Account Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Finance Account"
            >
                {formError && (
                    <div className="form-alert error" style={{ marginBottom: "16px" }}>
                        {formError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="standard-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="acc-name">
                            Account Name *
                        </label>
                        <input
                            id="acc-name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. HDFC Salary, Emergency Savings"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="acc-type">
                                Account Type
                            </label>
                            <select
                                id="acc-type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {ACCOUNT_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="acc-currency">
                                Currency
                            </label>
                            <select
                                id="acc-currency"
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="acc-balance">
                            Initial Balance
                        </label>
                        <input
                            id="acc-balance"
                            name="balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={form.balance}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="acc-desc">
                            Description (Optional)
                        </label>
                        <textarea
                            id="acc-desc"
                            name="description"
                            rows="2"
                            placeholder="Add brief details about this account"
                            value={form.description}
                            onChange={handleChange}
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: "24px" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default FinanceAccountsPage;
