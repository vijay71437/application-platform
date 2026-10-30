/**
 * Formats a number as a currency string.
 */
export function formatCurrency(amount, currency = "INR") {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return "₹0.00";
    }
    const num = Number(amount);
    
    // Support common currency symbols cleanly
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency || "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    } catch {
        return `₹${num.toFixed(2)}`;
    }
}

/**
 * Formats an ISO date string to a human-readable format.
 */
export function formatDate(dateString) {
    if (!dateString) return "—";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateString;
    }
}

/**
 * Formats an ISO datetime string to date & time.
 */
export function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "—";
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateTimeString;
    }
}
