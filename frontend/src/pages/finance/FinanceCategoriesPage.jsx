import { useState, useEffect } from "react";
import { Plus, Tag, ArrowDownRight, ArrowUpRight, RefreshCw, FolderTree } from "lucide-react";
import { getCategories, createCategory } from "../../services/financeService";
import { getApiError } from "../../api/apiError";
import { useNotification } from "../../components/notifications/NotificationContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { formatDate } from "../../utils/formatters";

function FinanceCategoriesPage() {
    const notification = useNotification();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL"); // ALL | INCOME | EXPENSE
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const [form, setForm] = useState({
        name: "",
        type: "EXPENSE",
        description: "",
    });

    async function loadCategories() {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            const apiError = getApiError(err);
            notification.error(apiError.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    function handleOpenModal(defaultType = "EXPENSE") {
        setForm({
            name: "",
            type: defaultType,
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
            setFormError("Category name is required.");
            return;
        }

        try {
            setSubmitting(true);
            await createCategory({
                name: form.name.trim(),
                type: form.type,
                description: form.description.trim() || null,
            });
            notification.success("Category created successfully!");
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            const apiError = getApiError(err);
            setFormError(apiError.message || "Failed to create category.");
        } finally {
            setSubmitting(false);
        }
    }

    const filteredCategories = categories.filter((cat) => {
        if (activeTab === "ALL") return true;
        return cat.type === activeTab;
    });

    const incomeCount = categories.filter((c) => c.type === "INCOME").length;
    const expenseCount = categories.filter((c) => c.type === "EXPENSE").length;

    return (
        <div>
            <PageHeader
                title="Finance Categories"
                description="Organize income streams and expense buckets to understand your cash flow."
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={loadCategories}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => handleOpenModal("EXPENSE")}
                        >
                            Add Category
                        </Button>
                    </div>
                }
            />

            {/* Stats row */}
            <div className="stats-grid" style={{ marginBottom: "24px" }}>
                <Card className="stat-card">
                    <div className="stat-label">Total Categories</div>
                    <div className="stat-value">{categories.length}</div>
                    <span className="stat-hint">Active classification groups</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Expense Categories</div>
                    <div className="stat-value" style={{ color: "#ef4444" }}>
                        {expenseCount}
                    </div>
                    <span className="stat-hint">Food, utilities, rent, etc.</span>
                </Card>
                <Card className="stat-card">
                    <div className="stat-label">Income Categories</div>
                    <div className="stat-value" style={{ color: "#10b981" }}>
                        {incomeCount}
                    </div>
                    <span className="stat-hint">Salary, investments, bonus, etc.</span>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="tab-bar" style={{ marginBottom: "20px" }}>
                <button
                    className={`tab-item ${activeTab === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveTab("ALL")}
                >
                    All Categories ({categories.length})
                </button>
                <button
                    className={`tab-item ${activeTab === "EXPENSE" ? "active" : ""}`}
                    onClick={() => setActiveTab("EXPENSE")}
                >
                    Expense ({expenseCount})
                </button>
                <button
                    className={`tab-item ${activeTab === "INCOME" ? "active" : ""}`}
                    onClick={() => setActiveTab("INCOME")}
                >
                    Income ({incomeCount})
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <span>Loading categories...</span>
                </div>
            ) : filteredCategories.length === 0 ? (
                <Card className="empty-state">
                    <FolderTree size={48} className="empty-state-icon" />
                    <h3>No categories found</h3>
                    <p>
                        {activeTab === "ALL"
                            ? "Get started by adding your first income or expense category."
                            : `No ${activeTab.toLowerCase()} categories found in this group.`}
                    </p>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => handleOpenModal(activeTab === "INCOME" ? "INCOME" : "EXPENSE")}
                    >
                        Create {activeTab === "INCOME" ? "Income" : "Expense"} Category
                    </Button>
                </Card>
            ) : (
                <div className="categories-grid">
                    {filteredCategories.map((cat) => {
                        const isIncome = cat.type === "INCOME";

                        return (
                            <Card key={cat.id} className="category-card">
                                <div className="category-card-header">
                                    <div
                                        className={`category-icon-badge ${
                                            isIncome ? "category-icon-income" : "category-icon-expense"
                                        }`}
                                    >
                                        {isIncome ? (
                                            <ArrowDownRight size={18} />
                                        ) : (
                                            <ArrowUpRight size={18} />
                                        )}
                                    </div>
                                    <Badge variant={isIncome ? "success" : "danger"}>
                                        {cat.type}
                                    </Badge>
                                </div>

                                <div className="category-card-body">
                                    <h4 className="category-card-name">{cat.name}</h4>
                                    <p className="category-card-desc">
                                        {cat.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="category-card-footer">
                                    <span className="text-muted">
                                        Created {formatDate(cat.createdAt)}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Finance Category"
            >
                {formError && (
                    <div className="form-alert error" style={{ marginBottom: "16px" }}>
                        {formError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="standard-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="cat-name">
                            Category Name *
                        </label>
                        <input
                            id="cat-name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Groceries, Salary, Streaming Subscriptions"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="cat-type">
                            Category Type
                        </label>
                        <div className="type-toggle-group">
                            <button
                                type="button"
                                className={`type-toggle-btn ${form.type === "EXPENSE" ? "active-expense" : ""}`}
                                onClick={() => setForm((p) => ({ ...p, type: "EXPENSE" }))}
                            >
                                <ArrowUpRight size={16} />
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`type-toggle-btn ${form.type === "INCOME" ? "active-income" : ""}`}
                                onClick={() => setForm((p) => ({ ...p, type: "INCOME" }))}
                            >
                                <ArrowDownRight size={16} />
                                Income
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="cat-desc">
                            Description (Optional)
                        </label>
                        <textarea
                            id="cat-desc"
                            name="description"
                            rows="2"
                            placeholder="What belongs in this category?"
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
                            Create Category
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default FinanceCategoriesPage;
