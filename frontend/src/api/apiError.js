export function getApiError(error) {
    const response = error?.response;

    let message =
        response?.data?.message ??
        "Something went wrong. Please try again.";

    // If validation error map exists in data (e.g. { field: "Error message" })
    if (response?.data?.data && typeof response.data.data === "object" && !Array.isArray(response.data.data)) {
        const fieldErrors = Object.entries(response.data.data)
            .map(([field, err]) => `${err}`)
            .filter(Boolean);
        if (fieldErrors.length > 0) {
            message = fieldErrors.join(" • ");
        }
    }

    return {
        status: response?.status ?? 0,
        message,
        errors: response?.data?.data ?? null,
        errorCode: response?.data?.errorCode ?? null,
        requestId: response?.data?.requestId ?? null,
    };
}
