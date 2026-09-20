export function getApiError(error) {
    const response = error?.response;

    return {
        status: response?.status ?? 0,
        message:
            response?.data?.message ??
            "Something went wrong. Please try again.",
        errorCode:
            response?.data?.errorCode ?? null,
        requestId:
            response?.data?.requestId ?? null,
    };
}