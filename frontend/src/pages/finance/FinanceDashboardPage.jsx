import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    PiggyBank,
    Clock,
    Plus,
    CreditCard,
    TrendingUp,
    ChevronRight,
    Calendar,
    Layers,
    Receipt,
    RefreshCw,
    PieChart,
} from "lucide-react";
import {
    getAccounts,
    getCategories,
    getTransactions,
    getMonthlySummary,
    getCategoryExpenseBreakdown,
    getPendingOccurrences,
} from "../../services/financeService";
import { getApiError } from "../../api/apiError";
import { useNotification } from "../../components/notifications/NotificationContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";

function FinanceDashboardPage() {
    const navigate = useNavigate();
    const notification = useNotification();

    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingOccurrences, setPendingOccurrences] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [categoryExpenses, setCategoryExpenses] = useState([]);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    async function loadFinanceData() {
        try {
            setLoading(true);

            // Compute first and last date of current month
            const firstDay = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
            const lastDayDate = new Date(currentYear, currentMonth, 0);
            const lastDay = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
                lastDayDate.getDate()
            ).padStart(2, "0")}`;

            const [accs, txs, pendings, summary, catExpenses] = await Promise.all([
                getAccounts().catch(() => []),
                getTransactions().catch(() => []),
                getPendingOccurrences().catch(() => []),
                getMonthlySummary(currentYear, currentMonth).catch(() => null),
                getCategoryExpenseBreakdown(firstDay, lastDay).catch(() => []),
            ]);

            setAccounts(accs);
            setTransactions(txs);
            setPendingOccurrences(pendings);
            setMonthlySummary(summary);
            setCategoryExpenses(catExpenses);
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to load finance data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFinanceData();
    }, []);

    const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const totalIncome = Number(monthlySummary?.totalIncome) || 0;
    const totalExpense = Number(monthlySummary?.totalExpense) || 0;
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div>
            <PageHeader
                title="Finance Center"
                description={`Overview of cash flow, accounts, and budgets for ${now.toLocaleString("default", {
                    month: "long",
                })} ${currentYear}.`}
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={loadFinanceData}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => navigate("/finance/transactions")}
                        >
                            Record Transaction
                        </Button>
                    </div>
                }
            />

            {/* Top Metric Cards */}
            <div className="finance-hero-grid">
                <Card className="finance-stat-card primary-gradient">
                    <div className="finance-stat-top">
                        <span className="finance-stat-title">Net Financial Worth</span>
                        <div className="finance-stat-icon-wrap">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="finance-stat-num">{formatCurrency(totalBalance)}</div>
                    <div className="finance-stat-sub">Across {accounts.length} linked accounts</div>
                </Card>

                <Card className="finance-stat-card income-card">
                    <div className="finance-stat-top">
                        <span className="finance-stat-title">Monthly Income</span>
                        <div className="finance-stat-icon-wrap green">
                            <ArrowDownRight size={20} />
                        </div>
                    </div>
                    <div className="finance-stat-num text-success">
                        +{formatCurrency(totalIncome)}
                    </div>
                    <div className="finance-stat-sub">Current month total</div>
                </Card>

                <Card className="finance-stat-card expense-card">
                    <div className="finance-stat-top">
                        <span className="finance-stat-title">Monthly Expenses</span>
                        <div className="finance-stat-icon-wrap red">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                    <div className="finance-stat-num text-danger">
                        -{formatCurrency(totalExpense)}
                    </div>
                    <div className="finance-stat-sub">Current month total</div>
                </Card>

                <Card className="finance-stat-card savings-card">
                    <div className="finance-stat-top">
                        <span className="finance-stat-title">Net Savings</span>
                        <div className="finance-stat-icon-wrap purple">
                            <PiggyBank size={20} />
                        </div>
                    </div>
                    <div
                        className="finance-stat-num"
                        style={{ color: netSavings >= 0 ? "#10b981" : "#ef4444" }}
                    >
                        {formatCurrency(netSavings)}
                    </div>
                    <div className="finance-stat-sub">
                        {savingsRate >= 0 ? `${savingsRate}% savings rate` : "Deficit this month"}
                    </div>
                </Card>
            </div>

            {/* Pending Occurrences Alert if any */}
            {pendingOccurrences.length > 0 && (
                <div className="pending-banner">
                    <div className="pending-banner-left">
                        <div className="pending-icon-circle">
                            <Clock size={20} />
                        </div>
                        <div>
                            <strong>
                                You have {pendingOccurrences.length} pending bill
                                {pendingOccurrences.length > 1 ? "s" : ""} due!
                            </strong>
                            <p>Confirm or skip recurring charges to keep balances accurate.</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="warning"
                        onClick={() => navigate("/finance/recurring")}
                    >
                        Review Due Bills
                    </Button>
                </div>
            )}

            {/* Main 2-column Dashboard Content */}
            <div className="dashboard-columns" style={{ marginTop: "24px" }}>
                {/* Left Column: Cash Flow & Spending Breakdown */}
                <div className="col-stack">
                    {/* Visual Cash Flow Bar */}
                    <Card>
                        <div className="card-header-flex">
                            <div>
                                <h3>Monthly Cash Flow Balance</h3>
                                <p className="text-muted">Income vs expenses ratio</p>
                            </div>
                        </div>

                        {totalIncome === 0 && totalExpense === 0 ? (
                            <div className="empty-sub-state">
                                <span>No income or expense recorded yet for this month.</span>
                            </div>
                        ) : (
                            <div className="cash-flow-breakdown">
                                <div className="bar-labels">
                                    <span className="text-success">
                                        Income ({formatCurrency(totalIncome)})
                                    </span>
                                    <span className="text-danger">
                                        Expense ({formatCurrency(totalExpense)})
                                    </span>
                                </div>
                                <div className="ratio-bar-track">
                                    <div
                                        className="ratio-bar-income"
                                        style={{
                                            width: `${
                                                (totalIncome / (totalIncome + totalExpense || 1)) * 100
                                            }%`,
                                        }}
                                    />
                                    <div
                                        className="ratio-bar-expense"
                                        style={{
                                            width: `${
                                                (totalExpense / (totalIncome + totalExpense || 1)) * 100
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Category Expense Breakdown */}
                    <Card>
                        <div className="card-header-flex">
                            <div>
                                <h3>Expense By Category</h3>
                                <p className="text-muted">Where your money went this month</p>
                            </div>
                            <Link to="/finance/categories" className="link-subtle">
                                Manage Categories <ChevronRight size={14} />
                            </Link>
                        </div>

                        {categoryExpenses.length === 0 ? (
                            <div className="empty-sub-state">
                                <span>No categorized expenses recorded for this month.</span>
                            </div>
                        ) : (
                            <div className="category-bars-list">
                                {categoryExpenses.map((cat, idx) => {
                                    const pct = Number(cat.percentage) || 0;
                                    return (
                                        <div key={idx} className="category-bar-row">
                                            <div className="category-bar-meta">
                                                <strong>{cat.categoryName || "Other"}</strong>
                                                <span>
                                                    {formatCurrency(cat.totalAmount)} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="mini-progress-track">
                                                <div
                                                    className="mini-progress-fill"
                                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Quick Accounts & Recent Transactions */}
                <div className="col-stack">
                    {/* Accounts Overview Widget */}
                    <Card>
                        <div className="card-header-flex">
                            <div>
                                <h3>My Accounts</h3>
                                <p className="text-muted">{accounts.length} active ledgers</p>
                            </div>
                            <Link to="/finance/accounts" className="link-subtle">
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        {accounts.length === 0 ? (
                            <div className="empty-sub-state">
                                <span>No accounts configured yet.</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    style={{ marginTop: "10px" }}
                                    onClick={() => navigate("/finance/accounts")}
                                >
                                    Add Account
                                </Button>
                            </div>
                        ) : (
                            <div className="account-list-mini">
                                {accounts.slice(0, 4).map((acc) => (
                                    <div key={acc.id} className="account-item-mini">
                                        <div className="account-item-left">
                                            <div className="account-item-avatar">
                                                <CreditCard size={16} />
                                            </div>
                                            <div>
                                                <strong>{acc.name}</strong>
                                                <span className="text-muted">{acc.type}</span>
                                            </div>
                                        </div>
                                        <strong>{formatCurrency(acc.balance, acc.currency)}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Recent Transactions Widget */}
                    <Card>
                        <div className="card-header-flex">
                            <div>
                                <h3>Recent Transactions</h3>
                                <p className="text-muted">Latest financial movements</p>
                            </div>
                            <Link to="/finance/transactions" className="link-subtle">
                                View All <ChevronRight size={14} />
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="empty-sub-state">
                                <span>No transactions found.</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    style={{ marginTop: "10px" }}
                                    onClick={() => navigate("/finance/transactions")}
                                >
                                    Record First Transaction
                                </Button>
                            </div>
                        ) : (
                            <div className="recent-tx-list">
                                {recentTransactions.map((tx) => {
                                    const isIncome = tx.type === "INCOME";
                                    return (
                                        <div key={tx.id} className="recent-tx-item">
                                            <div className="recent-tx-left">
                                                <div
                                                    className={`recent-tx-dot ${
                                                        isIncome ? "green" : "red"
                                                    }`}
                                                />
                                                <div>
                                                    <strong>{tx.description}</strong>
                                                    <span className="text-muted">
                                                        {formatDate(tx.transactionDate)} •{" "}
                                                        {tx.category?.name || "General"}
                                                    </span>
                                                </div>
                                            </div>
                                            <strong
                                                style={{
                                                    color: isIncome ? "#10b981" : "#ef4444",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {isIncome ? "+" : "-"}
                                                {formatCurrency(tx.amount)}
                                            </strong>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default FinanceDashboardPage;
