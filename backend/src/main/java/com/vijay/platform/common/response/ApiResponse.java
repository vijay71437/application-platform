package com.vijay.platform.common.response;

import java.time.Instant;

public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String errorCode;
    private Instant timestamp;

    private ApiResponse(
            boolean success,
            String message,
            T data,
            String errorCode) {

        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.timestamp = Instant.now();
    }

    public static <T> ApiResponse<T> success(
            String message,
            T data) {

        return new ApiResponse<>(
                true,
                message,
                data,
                null
        );
    }

    public static <T> ApiResponse<T> error(
            String message,
            String errorCode,
            T data) {

        return new ApiResponse<>(
                false,
                message,
                data,
                errorCode
        );
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}