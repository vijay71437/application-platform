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

    public static final String USER_NOT_FOUND="USER_NOT_FOUND";

    public static final String INVALID_CURRENT_PASSWORD =
            "AUTH_INVALID_CURRENT_PASSWORD";
    public static final String INVALID_REFRESH_TOKEN =
            "AUTH_INVALID_REFRESH_TOKEN";

    public static final String ROLE_NOT_FOUND =
            "AUTH_ROLE_NOT_FOUND";

    public static final String ROLE_ALREADY_EXISTS =
            "AUTH_ROLE_ALREADY_EXISTS";

    public static final String PERMISSION_NOT_FOUND =
            "AUTH_PERMISSION_NOT_FOUND";

    public static final String PERMISSION_ALREADY_EXISTS =
            "AUTH_PERMISSION_ALREADY_EXISTS";
}