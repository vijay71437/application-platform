import apiClient from "../api/apiClient";

/* =========================================================================
   FINANCE ACCOUNTS
   ========================================================================= */

export async function getAccounts() {
    const response = await apiClient.get("/finance/accounts");
    return response.data.data ?? [];
}

export async function createAccount(data) {
    const response = await apiClient.post("/finance/accounts", data);
    return response.data.data;
}

/* =========================================================================
   FINANCE CATEGORIES
   ========================================================================= */

export async function getCategories() {
    const response = await apiClient.get("/finance/categories");
    return response.data.data ?? [];
}

export async function createCategory(data) {
    const response = await apiClient.post("/finance/categories", data);
    return response.data.data;
}

/* =========================================================================
   FINANCE TRANSACTIONS
   ========================================================================= */

export async function getTransactions() {
    const response = await apiClient.get("/finance/transactions");
    return response.data.data ?? [];
}

export async function getTransactionById(id) {
    const response = await apiClient.get(`/finance/transactions/${id}`);
    return response.data.data;
}

export async function getTransactionsPage({
    page = 0,
    size = 20,
    sortBy = "transactionDate",
    direction = "DESC",
} = {}) {
    const response = await apiClient.get("/finance/transactions/page", {
        params: { page, size, sortBy, direction },
    });
    return response.data.data;
}

export async function searchTransactions(filters = {}) {
    // Filter out undefined, empty or null params
    const cleanParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
    );
    const response = await apiClient.get("/finance/transactions/search", {
        params: cleanParams,
    });
    return response.data.data ?? [];
}

export async function createTransaction(data) {
    const response = await apiClient.post("/finance/transactions", data);
    return response.data.data;
}

export async function updateTransaction(id, data) {
    const response = await apiClient.put(`/finance/transactions/${id}`, data);
    return response.data.data;
}

export async function deleteTransaction(id) {
    const response = await apiClient.delete(`/finance/transactions/${id}`);
    return response.data;
}

export async function getMonthlySummary(year, month) {
    const response = await apiClient.get("/finance/transactions/summary/monthly", {
        params: { year, month },
    });
    return response.data.data;
}

export async function getCategoryExpenseBreakdown(startDate, endDate) {
    const response = await apiClient.get("/finance/transactions/summary/categories", {
        params: { startDate, endDate },
    });
    return response.data.data ?? [];
}

/* =========================================================================
   RECURRING TRANSACTIONS
   ========================================================================= */

export async function getRecurringTransactions() {
    const response = await apiClient.get("/finance/recurring-transactions");
    return response.data.data ?? [];
}

export async function getActiveRecurringTransactions() {
    const response = await apiClient.get("/finance/recurring-transactions/active");
    return response.data.data ?? [];
}

export async function createRecurringTransaction(data) {
    const response = await apiClient.post("/finance/recurring-transactions", data);
    return response.data.data;
}

export async function updateRecurringTransaction(id, data) {
    const response = await apiClient.put(`/finance/recurring-transactions/${id}`, data);
    return response.data.data;
}

export async function pauseRecurringTransaction(id) {
    const response = await apiClient.patch(`/finance/recurring-transactions/${id}/pause`);
    return response.data.data;
}

export async function resumeRecurringTransaction(id) {
    const response = await apiClient.patch(`/finance/recurring-transactions/${id}/resume`);
    return response.data.data;
}

export async function deactivateRecurringTransaction(id) {
    const response = await apiClient.delete(`/finance/recurring-transactions/${id}`);
    return response.data;
}

/* =========================================================================
   RECURRING OCCURRENCES
   ========================================================================= */

export async function generateOccurrences(throughDate) {
    const response = await apiClient.post("/finance/recurring-occurrences/generate", null, {
        params: { throughDate },
    });
    return response.data.data;
}

export async function getPendingOccurrences() {
    const response = await apiClient.get("/finance/recurring-occurrences/pending");
    return response.data.data ?? [];
}

export async function confirmOccurrence(id) {
    const response = await apiClient.post(`/finance/recurring-occurrences/${id}/confirm`);
    return response.data.data;
}

export async function skipOccurrence(id) {
    const response = await apiClient.patch(`/finance/recurring-occurrences/${id}/skip`);
    return response.data.data;
}

export async function getOccurrenceHistory(startDate, endDate) {
    const response = await apiClient.get("/finance/recurring-occurrences/history", {
        params: { startDate, endDate },
    });
    return response.data.data ?? [];
}

export async function getOccurrenceSummary(startDate, endDate) {
    const response = await apiClient.get("/finance/recurring-occurrences/summary", {
        params: { startDate, endDate },
    });
    return response.data.data;
}
