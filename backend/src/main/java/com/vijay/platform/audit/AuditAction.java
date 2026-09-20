package com.vijay.platform.audit;

public final class AuditAction {

    private AuditAction() {
    }

    public static final String USER_REGISTERED =
            "USER_REGISTERED";

    public static final String USER_CREATED =
            "USER_CREATED";

    public static final String USER_UPDATED =
            "USER_UPDATED";

    public static final String USER_DEACTIVATED =
            "USER_DEACTIVATED";

    public static final String LOGIN_SUCCESS =
            "LOGIN_SUCCESS";

    public static final String LOGIN_FAILED =
            "LOGIN_FAILED";

    public static final String PASSWORD_CHANGED =
            "PASSWORD_CHANGED";

    public static final String TOKEN_REFRESHED =
            "TOKEN_REFRESHED";

    public static final String LOGOUT =
            "LOGOUT";
}