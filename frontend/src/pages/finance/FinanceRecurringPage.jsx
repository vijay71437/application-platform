import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    CalendarClock,
    Play,
    Pause,
    Trash2,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Wand2,
    Clock,
    AlertCircle,
} from "lucide-react";
import {
    getRecurringTransactions,
    createRecurringTransaction,
    pauseRecurringTransaction,
    resumeRecurringTransaction,
    deactivateRecurringTransaction,
    generateOccurrences,
    getPendingOccurrences,
    confirmOccurrence,
    skipOccurrence,
    getAccounts,
    getCategories,
} from "../../services/financeService";
import { getApiError } from "../../api/apiError";
import { useNotification } from "../../components/notifications/NotificationContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";

const FREQUENCIES = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "BIWEEKLY", label: "Bi-Weekly (Every 2 wks)" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
    { value: "YEARLY", label: "Yearly" },
];

function FinanceRecurringPage() {
    const notification = useNotification();
    const [activeTab, setActiveTab] = useState("PENDING"); // PENDING | TEMPLATES
    const [recurringList, setRecurringList] = useState([]);
    const [pendingOccurrences, setPendingOccurrences] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Generate Modal
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [throughDate, setThroughDate] = useState(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    const [generating, setGenerating] = useState(false);

    // Create Recurring Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        accountId: "",
        categoryId: "",
        transactionType: "EXPENSE",
        amount: "",
        description: "",
        frequency: "MONTHLY",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
    });

    async function loadData() {
        try {
            setLoading(true);
            const [recs, pendings, accs, cats] = await Promise.all([
                getRecurringTransactions(),
                getPendingOccurrences(),
                getAccounts(),
                getCategories(),
            ]);
            setRecurringList(recs);
            setPendingOccurrences(pendings);
            setAccounts(accs);
            setCategories(cats);
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to load recurring data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Generate Occurrences Trigger
    async function handleGenerate(e) {
        e.preventDefault();
        try {
            setGenerating(true);
            const count = await generateOccurrences(throughDate);
            notification.success(`Generated ${count ?? 0} occurrence(s) through ${formatDate(throughDate)}!`);
            setIsGenerateModalOpen(false);
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to generate occurrences.");
        } finally {
            setGenerating(false);
        }
    }

    // Confirm occurrence
    async function handleConfirm(id) {
        try {
            await confirmOccurrence(id);
            notification.success("Occurrence confirmed & posted to transactions!");
            setPendingOccurrences((prev) => prev.filter((o) => o.id !== id));
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to confirm occurrence.");
        }
    }

    // Skip occurrence
    async function handleSkip(id) {
        try {
            await skipOccurrence(id);
            notification.info("Occurrence marked as skipped.");
            setPendingOccurrences((prev) => prev.filter((o) => o.id !== id));
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to skip occurrence.");
        }
    }

    // Pause recurring rule
    async function handlePause(id) {
        try {
            await pauseRecurringTransaction(id);
            notification.info("Recurring rule paused.");
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to pause.");
        }
    }

    // Resume recurring rule
    async function handleResume(id) {
        try {
            await resumeRecurringTransaction(id);
            notification.success("Recurring rule resumed.");
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to resume.");
        }
    }

    // Deactivate rule
    async function handleDeactivate(id) {
        if (!window.confirm("Are you sure you want to deactivate this recurring schedule?")) {
            return;
        }
        try {
            await deactivateRecurringTransaction(id);
            notification.success("Recurring schedule deactivated.");
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to deactivate.");
        }
    }

    // Create Recurring Submit
    async function handleCreateRecurring(e) {
        e.preventDefault();
        if (!form.accountId) {
            setFormError("Account is required. Please select or create an account.");
            return;
        }
        if (!form.categoryId) {
            setFormError("Category is required. Please select or create a category.");
            return;
        }
        if (!form.transactionType) {
            setFormError("Transaction type is required.");
            return;
        }
        if (!form.amount || Number(form.amount) <= 0) {
            setFormError("Valid amount is required.");
            return;
        }
        if (!form.startDate) {
            setFormError("Start date is required.");
            return;
        }

        try {
            setSubmitting(true);
            await createRecurringTransaction({
                accountId: Number(form.accountId),
                categoryId: Number(form.categoryId),
                transactionType: form.transactionType,
                amount: parseFloat(form.amount),
                description: form.description.trim() || null,
                frequency: form.frequency,
                startDate: form.startDate,
                endDate: form.endDate || null,
            });
            notification.success("Recurring transaction created!");
            setIsCreateModalOpen(false);
            setForm({
                accountId: accounts[0]?.id || "",
                categoryId: categories[0]?.id || "",
                transactionType: "EXPENSE",
                amount: "",
                description: "",
                frequency: "MONTHLY",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
            });
            loadData();
        } catch (err) {
            const apiError = getApiError(err);
            setFormError(apiError.message || "Failed to create recurring rule.");
        } finally {
            setSubmitting(false);
        }
    }

    const pendingTotal = pendingOccurrences.reduce(
        (sum, o) => sum + (Number(o.recurringTransaction?.amount || o.amount) || 0),
        0
    );

    const hasPrerequisites = accounts.length > 0 && categories.length > 0;

    return (
        <div>
            <PageHeader
                title="Recurring & Subscriptions"
                description="Automate repeating bills, subscriptions, paychecks and scheduled payments."
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            icon={Wand2}
                            onClick={() => setIsGenerateModalOpen(true)}
                        >
                            Generate Due Bills
                        </Button>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={loadData}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => {
                                setFormError("");
                                setForm({
                                    accountId: accounts[0]?.id || "",
                                    categoryId: categories[0]?.id || "",
                                    transactionType: "EXPENSE",
                                    amount: "",
                                    description: "",
                                    frequency: "MONTHLY",
                                    startDate: new Date().toISOString().split("T")[0],
                                    endDate: "",
                                });
                                setIsCreateModalOpen(true);
                            }}
                        >
                            New Recurring Rule
                        </Button>
                    </div>
                }
            />

            {/* Prerequisites Warning */}
            {!loading && !hasPrerequisites && (
                <div className="pending-banner" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                    <div className="pending-banner-left">
                        <div className="pending-icon-circle" style={{ background: "#3b82f6" }}>
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <strong style={{ color: "#1e3a8a" }}>
                                Accounts & Categories Setup Needed
                            </strong>
                            <p style={{ color: "#1d4ed8" }}>
                                Recurring rules require both an account and category. Please create them first.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {accounts.length === 0 && (
                            <Link to="/finance/accounts">
                                <Button size="sm" variant="primary">
                                    + Add Account
                                </Button>
                            </Link>
                        )}
                        {categories.length === 0 && (
                            <Link to="/finance/categories">
                                <Button size="sm" variant="outline">
                                    + Add Category
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Metrics */}
            <div className="stats-grid" style={{ marginBottom: "20px" }}>
                <Card className="stat-card">
                    <div className="stat-label">Pending Due Items</div>
                    <div className="stat-value" style={{ color: "#f59e0b" }}>
                        {pendingOccurrences.length}
                    </div>
                    <span className="stat-hint">Occurrences awaiting confirmation</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Pending Total Amount</div>
                    <div className="stat-value" style={{ color: "#ef4444" }}>
                        {formatCurrency(pendingTotal)}
                    </div>
                    <span className="stat-hint">Estimated outflow / inflow</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Active Rules</div>
                    <div className="stat-value" style={{ color: "#10b981" }}>
                        {recurringList.filter((r) => r.active && !r.paused).length}
                    </div>
                    <span className="stat-hint">Of {recurringList.length} total templates</span>
                </Card>
            </div>

            {/* Tabs */}
            <div className="tab-bar" style={{ marginBottom: "20px" }}>
                <button
                    className={`tab-item ${activeTab === "PENDING" ? "active" : ""}`}
                    onClick={() => setActiveTab("PENDING")}
                >
                    <Clock size={16} style={{ marginRight: "6px" }} />
                    Pending Occurrences ({pendingOccurrences.length})
                </button>
                <button
                    className={`tab-item ${activeTab === "TEMPLATES" ? "active" : ""}`}
                    onClick={() => setActiveTab("TEMPLATES")}
                >
                    <CalendarClock size={16} style={{ marginRight: "6px" }} />
                    Recurring Templates ({recurringList.length})
                </button>
            </div>

            {/* TAB 1: PENDING OCCURRENCES */}
            {activeTab === "PENDING" && (
                <Card>
                    <div className="table-toolbar">
                        <div>
                            <h3 className="section-title">Pending Occurrences Queue</h3>
                            <p className="section-description">
                                Review upcoming bills. Confirming will create the actual transaction record.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            icon={Wand2}
                            size="sm"
                            onClick={() => setIsGenerateModalOpen(true)}
                        >
                            Run Generator
                        </Button>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner" />
                            <span>Loading pending occurrences...</span>
                        </div>
                    ) : pendingOccurrences.length === 0 ? (
                        <div className="empty-state">
                            <CheckCircle2 size={48} className="empty-state-icon" style={{ color: "#10b981" }} />
                            <h3>All caught up!</h3>
                            <p>No pending occurrences due at this moment. You can generate occurrences for future dates.</p>
                            <Button
                                variant="primary"
                                icon={Wand2}
                                onClick={() => setIsGenerateModalOpen(true)}
                            >
                                Generate for Next 30 Days
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Scheduled Date</th>
                                        <th>Description</th>
                                        <th>Frequency</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: "right" }}>Amount</th>
                                        <th style={{ textAlign: "right" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOccurrences.map((occ) => {
                                        const rec = occ.recurringTransaction || {};
                                        const txType = rec.transactionType || rec.type || occ.transactionType || "EXPENSE";
                                        const isIncome = txType === "INCOME";

                                        return (
                                            <tr key={occ.id}>
                                                <td style={{ whiteSpace: "nowrap" }}>
                                                    <strong>{formatDate(occ.scheduledDate)}</strong>
                                                </td>
                                                <td>
                                                    <strong>{rec.description || occ.description || "Recurring item"}</strong>
                                                    {rec.accountName && (
                                                        <span className="tx-notes">Account: {rec.accountName}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="category-pill">
                                                        {rec.frequency || "MONTHLY"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge variant="warning">{occ.status}</Badge>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <strong
                                                        style={{
                                                            color: isIncome ? "#10b981" : "#ef4444",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {isIncome ? "+" : "-"}
                                                        {formatCurrency(rec.amount || occ.amount)}
                                                    </strong>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <div
                                                        style={{
                                                            display: "inline-flex",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            icon={CheckCircle2}
                                                            onClick={() => handleConfirm(occ.id)}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            icon={XCircle}
                                                            onClick={() => handleSkip(occ.id)}
                                                        >
                                                            Skip
                                                        </Button>
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
            )}

            {/* TAB 2: TEMPLATES */}
            {activeTab === "TEMPLATES" && (
                <Card>
                    <div className="table-toolbar">
                        <div>
                            <h3 className="section-title">Configured Recurring Rules</h3>
                            <p className="section-description">
                                Automated templates that define repeating charges, salaries, and subscriptions.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner" />
                            <span>Loading templates...</span>
                        </div>
                    ) : recurringList.length === 0 ? (
                        <div className="empty-state">
                            <CalendarClock size={48} className="empty-state-icon" />
                            <h3>No recurring templates</h3>
                            <p>Set up automatic recurrence for rent, subscriptions, SIPs, or salary.</p>
                            <Button
                                variant="primary"
                                icon={Plus}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Create First Rule
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Frequency</th>
                                        <th>Account & Category</th>
                                        <th>Start / End Date</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: "right" }}>Amount</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recurringList.map((rec) => {
                                        const txType = rec.transactionType || rec.type;
                                        const isIncome = txType === "INCOME";
                                        const accTitle = rec.accountName || rec.account?.name;
                                        const catTitle = rec.categoryName || rec.category?.name;

                                        return (
                                            <tr key={rec.id}>
                                                <td>
                                                    <strong>{rec.description || "—"}</strong>
                                                </td>
                                                <td>
                                                    <span className="category-pill">{rec.frequency}</span>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: "12px" }}>
                                                        {accTitle && (
                                                            <span className="account-pill" style={{ marginRight: "4px" }}>
                                                                {accTitle}
                                                            </span>
                                                        )}
                                                        {catTitle && (
                                                            <span className="category-pill">
                                                                {catTitle}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-muted" style={{ fontSize: "12px" }}>
                                                    {formatDate(rec.startDate)}
                                                    {rec.endDate ? ` → ${formatDate(rec.endDate)}` : " (Forever)"}
                                                </td>
                                                <td>
                                                    {!rec.active ? (
                                                        <Badge variant="neutral">Inactive</Badge>
                                                    ) : rec.paused ? (
                                                        <Badge variant="warning">Paused</Badge>
                                                    ) : (
                                                        <Badge variant="success">Active</Badge>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <strong
                                                        style={{
                                                            color: isIncome ? "#10b981" : "#ef4444",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {isIncome ? "+" : "-"}
                                                        {formatCurrency(rec.amount)}
                                                    </strong>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <div style={{ display: "inline-flex", gap: "6px" }}>
                                                        {rec.active && (
                                                            rec.paused ? (
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn"
                                                                    onClick={() => handleResume(rec.id)}
                                                                    title="Resume schedule"
                                                                >
                                                                    <Play size={14} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="action-icon-btn"
                                                                    onClick={() => handlePause(rec.id)}
                                                                    title="Pause schedule"
                                                                >
                                                                    <Pause size={14} />
                                                                </button>
                                                            )
                                                        )}
                                                        {rec.active && (
                                                            <button
                                                                type="button"
                                                                className="action-icon-btn delete"
                                                                onClick={() => handleDeactivate(rec.id)}
                                                                title="Deactivate schedule"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
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
            )}

            {/* GENERATE MODAL */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Generate Recurring Occurrences"
            >
                <form onSubmit={handleGenerate} className="standard-form">
                    <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
                        Specify a future date. The platform will calculate all upcoming dates for active rules
                        and create pending occurrences waiting for your confirmation.
                    </p>
                    <div className="form-group">
                        <label className="form-label" htmlFor="gen-through">
                            Generate Occurrences Through *
                        </label>
                        <input
                            id="gen-through"
                            type="date"
                            required
                            value={throughDate}
                            onChange={(e) => setThroughDate(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-actions" style={{ marginTop: "24px" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGenerateModalOpen(false)}
                            disabled={generating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={generating} icon={Wand2}>
                            Run Generation
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* CREATE RECURRING RULE MODAL */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="New Recurring Transaction Rule"
            >
                {formError && (
                    <div className="form-alert error" style={{ marginBottom: "16px" }}>
                        {formError}
                    </div>
                )}
                <form onSubmit={handleCreateRecurring} className="standard-form">
                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label">Transaction Type *</label>
                            <select
                                value={form.transactionType}
                                onChange={(e) => setForm((p) => ({ ...p, transactionType: e.target.value }))}
                                className="form-select"
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Frequency *</label>
                            <select
                                value={form.frequency}
                                onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}
                                className="form-select"
                            >
                                {FREQUENCIES.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="rec-amount">
                                Amount (₹) *
                            </label>
                            <input
                                id="rec-amount"
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                value={form.amount}
                                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="rec-start-date">
                                Start Date *
                            </label>
                            <input
                                id="rec-start-date"
                                type="date"
                                required
                                value={form.startDate}
                                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="rec-account">
                                Account *
                            </label>
                            <select
                                id="rec-account"
                                required
                                value={form.accountId}
                                onChange={(e) => setForm((p) => ({ ...p, accountId: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Select Account</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="rec-category">
                                Category *
                            </label>
                            <select
                                id="rec-category"
                                required
                                value={form.categoryId}
                                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="rec-desc">
                            Description (Max 255 chars)
                        </label>
                        <input
                            id="rec-desc"
                            type="text"
                            maxLength={255}
                            placeholder="e.g. Netflix, Gym Membership, House Rent"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="rec-end-date">
                            End Date (Optional)
                        </label>
                        <input
                            id="rec-end-date"
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                            className="form-input"
                        />
                        <span className="stat-hint">Leave blank to recur indefinitely</span>
                    </div>

                    <div className="form-actions" style={{ marginTop: "24px" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsCreateModalOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            Create Recurring Rule
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default FinanceRecurringPage;
