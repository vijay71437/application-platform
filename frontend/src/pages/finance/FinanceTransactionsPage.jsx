import { useState, useEffect } from "react";
import {
    Plus,
    Filter,
    Trash2,
    Edit2,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRightLeft,
    Receipt,
    Calendar,
    Search,
} from "lucide-react";
import {
    getAccounts,
    getCategories,
    searchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "../../services/financeService";
import { getApiError } from "../../api/apiError";
import { useNotification } from "../../components/notifications/NotificationContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";

const TRANSACTION_TYPES = [
    { value: "EXPENSE", label: "Expense", icon: ArrowUpRight, color: "danger" },
    { value: "INCOME", label: "Income", icon: ArrowDownRight, color: "success" },
    { value: "TRANSFER", label: "Transfer", icon: ArrowRightLeft, color: "info" },
];

function FinanceTransactionsPage() {
    const notification = useNotification();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filters, setFilters] = useState({
        accountId: "",
        categoryId: "",
        type: "",
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
    });
    const [showFilters, setShowFilters] = useState(false);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const initialFormData = {
        accountId: "",
        categoryId: "",
        type: "EXPENSE",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
        notes: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    async function loadData() {
        try {
            setLoading(true);
            const [accs, cats, txs] = await Promise.all([
                getAccounts(),
                getCategories(),
                searchTransactions(filters),
            ]);
            setAccounts(accs);
            setCategories(cats);
            setTransactions(txs);
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [filters.accountId, filters.categoryId, filters.type]);

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }

    function handleResetFilters() {
        setFilters({
            accountId: "",
            categoryId: "",
            type: "",
            startDate: "",
            endDate: "",
            minAmount: "",
            maxAmount: "",
        });
        loadData();
    }

    function handleOpenAdd() {
        setEditingTx(null);
        setFormData({
            ...initialFormData,
            accountId: accounts[0]?.id || "",
            categoryId: categories[0]?.id || "",
        });
        setFormError("");
        setIsAddModalOpen(true);
    }

    function handleOpenEdit(tx) {
        setEditingTx(tx);
        setFormData({
            accountId: tx.account?.id || tx.accountId || "",
            categoryId: tx.category?.id || tx.categoryId || "",
            type: tx.type || "EXPENSE",
            amount: tx.amount || "",
            description: tx.description || "",
            transactionDate: tx.transactionDate || "",
            notes: tx.notes || "",
        });
        setFormError("");
        setIsAddModalOpen(true);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!formData.description.trim()) {
            setFormError("Description is required.");
            return;
        }
        if (!formData.amount || Number(formData.amount) <= 0) {
            setFormError("Please enter a valid positive amount.");
            return;
        }
        if (!formData.transactionDate) {
            setFormError("Transaction date is required.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                accountId: formData.accountId ? Number(formData.accountId) : null,
                categoryId: formData.categoryId ? Number(formData.categoryId) : null,
                type: formData.type,
                amount: parseFloat(formData.amount),
                description: formData.description.trim(),
                transactionDate: formData.transactionDate,
                notes: formData.notes.trim() || null,
            };

            if (editingTx) {
                await updateTransaction(editingTx.id, payload);
                notification.success("Transaction updated successfully!");
            } else {
                await createTransaction(payload);
                notification.success("Transaction recorded successfully!");
            }

            setIsAddModalOpen(false);
            setEditingTx(null);
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            setFormError(apiError.message || "Failed to save transaction.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmed) return;

        try {
            await deleteTransaction(id);
            notification.success("Transaction deleted successfully!");
            setTransactions((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to delete transaction.");
        }
    }

    // Totals for current filtered list
    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return (
        <div>
            <PageHeader
                title="Transactions"
                description="View, log, filter and audit all cash inflows, outflows and transfers."
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            icon={Filter}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? "Hide Filters" : "Filter"}
                        </Button>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={loadData}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
                            Record Transaction
                        </Button>
                    </div>
                }
            />

            {/* Quick Metrics */}
            <div className="stats-grid" style={{ marginBottom: "20px" }}>
                <Card className="stat-card">
                    <div className="stat-label">Total Volume ({transactions.length})</div>
                    <div className="stat-value">{transactions.length} records</div>
                    <span className="stat-hint">In current selection</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Total Inflow (Income)</div>
                    <div className="stat-value" style={{ color: "#10b981" }}>
                        +{formatCurrency(totalIncome)}
                    </div>
                    <span className="stat-hint">Total income recorded</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Total Outflow (Expense)</div>
                    <div className="stat-value" style={{ color: "#ef4444" }}>
                        -{formatCurrency(totalExpense)}
                    </div>
                    <span className="stat-hint">Total expense recorded</span>
                </Card>
            </div>

            {/* Filter Drawer */}
            {showFilters && (
                <Card style={{ marginBottom: "20px", background: "#f8fafc" }}>
                    <div className="filter-grid">
                        <div className="form-group">
                            <label className="form-label">Account</label>
                            <select
                                name="accountId"
                                value={filters.accountId}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All Accounts</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="categoryId"
                                value={filters.categoryId}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All Types</option>
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">From Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">To Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="form-input"
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                            <Button variant="primary" icon={Search} onClick={loadData}>
                                Apply
                            </Button>
                            <Button variant="secondary" onClick={handleResetFilters}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Transactions Table Card */}
            <Card>
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <span>Loading transactions...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <Receipt size={48} className="empty-state-icon" />
                        <h3>No transactions found</h3>
                        <p>No transactions match your current criteria. Record one to get started.</p>
                        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
                            Record Transaction
                        </Button>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Account</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: "right" }}>Amount</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => {
                                    const isIncome = tx.type === "INCOME";
                                    const isExpense = tx.type === "EXPENSE";

                                    return (
                                        <tr key={tx.id}>
                                            <td className="text-muted" style={{ whiteSpace: "nowrap" }}>
                                                {formatDate(tx.transactionDate)}
                                            </td>
                                            <td>
                                                <div className="tx-desc-cell">
                                                    <strong>{tx.description}</strong>
                                                    {tx.notes && (
                                                        <span className="tx-notes">{tx.notes}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-pill">
                                                    {tx.category?.name || tx.categoryName || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="account-pill">
                                                    {tx.account?.name || tx.accountName || "—"}
                                                </span>
                                            </td>
                                            <td>
                                                <Badge
                                                    variant={
                                                        isIncome
                                                            ? "success"
                                                            : isExpense
                                                            ? "danger"
                                                            : "info"
                                                    }
                                                >
                                                    {tx.type}
                                                </Badge>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <strong
                                                    style={{
                                                        color: isIncome
                                                            ? "#10b981"
                                                            : isExpense
                                                            ? "#ef4444"
                                                            : "#3b82f6",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {isIncome ? "+" : isExpense ? "-" : ""}
                                                    {formatCurrency(tx.amount)}
                                                </strong>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <div
                                                    style={{
                                                        display: "inline-flex",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        className="action-icon-btn edit"
                                                        onClick={() => handleOpenEdit(tx)}
                                                        title="Edit transaction"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="action-icon-btn delete"
                                                        onClick={() => handleDelete(tx.id)}
                                                        title="Delete transaction"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={editingTx ? "Edit Transaction" : "Record New Transaction"}
            >
                {formError && (
                    <div className="form-alert error" style={{ marginBottom: "16px" }}>
                        {formError}
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="standard-form">
                    <div className="form-group">
                        <label className="form-label">Transaction Type</label>
                        <div className="type-toggle-group-3">
                            {TRANSACTION_TYPES.map((t) => {
                                const Icon = t.icon;
                                const isSelected = formData.type === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        className={`type-toggle-btn ${
                                            isSelected ? `active-${t.color}` : ""
                                        }`}
                                        onClick={() =>
                                            setFormData((p) => ({ ...p, type: t.value }))
                                        }
                                    >
                                        <Icon size={16} />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-amount">
                                Amount (₹) *
                            </label>
                            <input
                                id="tx-amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, amount: e.target.value }))
                                }
                                className="form-input"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-date">
                                Date *
                            </label>
                            <input
                                id="tx-date"
                                name="transactionDate"
                                type="date"
                                required
                                value={formData.transactionDate}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        transactionDate: e.target.value,
                                    }))
                                }
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="tx-desc">
                            Description *
                        </label>
                        <input
                            id="tx-desc"
                            name="description"
                            type="text"
                            required
                            placeholder="e.g. Grocery run at Spencer's, Monthly salary"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, description: e.target.value }))
                            }
                            className="form-input"
                        />
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-account">
                                Account
                            </label>
                            <select
                                id="tx-account"
                                name="accountId"
                                value={formData.accountId}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, accountId: e.target.value }))
                                }
                                className="form-select"
                            >
                                <option value="">Select Account (Optional)</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-category">
                                Category
                            </label>
                            <select
                                id="tx-category"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, categoryId: e.target.value }))
                                }
                                className="form-select"
                            >
                                <option value="">Select Category (Optional)</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="tx-notes">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="tx-notes"
                            name="notes"
                            rows="2"
                            placeholder="Additional details, bill invoice IDs, or context"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, notes: e.target.value }))
                            }
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: "24px" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsAddModalOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            {editingTx ? "Save Changes" : "Save Transaction"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default FinanceTransactionsPage;
