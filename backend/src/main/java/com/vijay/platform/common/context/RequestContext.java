package com.vijay.platform.common.context;

public final class RequestContext {

    private static final ThreadLocal<String> REQUEST_ID =
            new ThreadLocal<>();

    private static final ThreadLocal<String> CLIENT_IP =
            new ThreadLocal<>();

    private static final ThreadLocal<String> USER_AGENT =
            new ThreadLocal<>();

    private RequestContext() {
    }

    public static void setRequestId(String requestId) {
        REQUEST_ID.set(requestId);
    }

    public static String getRequestId() {
        return REQUEST_ID.get();
    }

    public static void setClientIp(String clientIp) {
        CLIENT_IP.set(clientIp);
    }

    public static String getClientIp() {
        return CLIENT_IP.get();
    }

    public static void setUserAgent(String userAgent) {
        USER_AGENT.set(userAgent);
    }

    public static String getUserAgent() {
        return USER_AGENT.get();
    }

    public static void clear() {
        REQUEST_ID.remove();
        CLIENT_IP.remove();
        USER_AGENT.remove();
    }
}