import axios from "axios";

import { env } from "../config/env";

import {
    clearAuthentication,
    getAuthToken as getAccessToken,
    getRefreshToken,
    updateAccessToken,
} from "../auth/authToken";

const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {

        if (!config.skipAuth) {

            const accessToken = getAccessToken();

            if (accessToken) {
                config.headers.Authorization =
                    `Bearer ${accessToken}`;
            }
        }

        config.headers["X-Request-ID"] =
            crypto.randomUUID();

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;

let refreshSubscribers = [];

function subscribeToTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function notifyTokenRefresh(accessToken) {

    refreshSubscribers.forEach((callback) => {
        callback(accessToken);
    });

    refreshSubscribers = [];
}

function rejectTokenRefresh(error) {

    refreshSubscribers.forEach((callback) => {
        callback(null, error);
    });

    refreshSubscribers = [];
}

apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest?.skipAuth ||
            originalRequest?._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearAuthentication();

            return Promise.reject(error);
        }

        if (isRefreshing) {

            return new Promise((resolve, reject) => {

                subscribeToTokenRefresh(
                    (accessToken, refreshError) => {

                        if (refreshError || !accessToken) {
                            reject(refreshError || error);
                            return;
                        }

                        originalRequest.headers.Authorization =
                            `Bearer ${accessToken}`;

                        resolve(
                            apiClient(originalRequest)
                        );
                    }
                );
            });
        }

        isRefreshing = true;

        try {

            const response = await axios.post(
                `${env.apiBaseUrl}/auth/refresh`,
                {
                    refreshToken,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data.data;

            const newAccessToken =
                data.accessToken;

            updateAccessToken(newAccessToken);

            isRefreshing = false;

            notifyTokenRefresh(newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);

        } catch (refreshError) {

            isRefreshing = false;

            rejectTokenRefresh(refreshError);

            clearAuthentication();

            return Promise.reject(refreshError);
        }
    }
);

export default apiClient;