package com.vijay.platform.common.exception;

public final class ErrorCode {

    private ErrorCode() {
    }

    public static final String VALIDATION_FAILED =
            "COMMON_VALIDATION_FAILED";

    public static final String INTERNAL_SERVER_ERROR =
            "COMMON_INTERNAL_SERVER_ERROR";

    public static final String USERNAME_ALREADY_EXISTS =
            "USER_USERNAME_ALREADY_EXISTS";

    public static final String EMAIL_ALREADY_EXISTS =
            "USER_EMAIL_ALREADY_EXISTS";

    public static final String INVALID_CREDENTIALS =
            "AUTH_INVALID_CREDENTIALS";

    public static final String AUTHENTICATION_REQUIRED =
            "AUTH_AUTHENTICATION_REQUIRED";

    public static final String ACCESS_DENIED =
            "AUTH_ACCESS_DENIED";
}