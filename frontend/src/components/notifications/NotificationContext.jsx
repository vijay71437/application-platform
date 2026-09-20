import {
    createContext,
    useContext,
    useState,
} from "react";

const NotificationContext =
    createContext(null);

export function NotificationProvider({
    children,
}) {
    const [notifications, setNotifications] =
        useState([]);

    function removeNotification(id) {
        setNotifications((current) =>
            current.filter(
                (notification) =>
                    notification.id !== id
            )
        );
    }

    function notify(
        message,
        type = "success",
        duration = 4000
    ) {
        const id =
            Date.now() +
            Math.random();

        setNotifications((current) => [
            ...current,
            {
                id,
                message,
                type,
            },
        ]);

        setTimeout(() => {
            removeNotification(id);
        }, duration);
    }

    function success(message) {
        notify(message, "success");
    }

    function error(message) {
        notify(message, "error");
    }

    function info(message) {
        notify(message, "info");
    }

    const value = {
        notify,
        success,
        error,
        info,
        removeNotification,
    };

    return (
        <NotificationContext.Provider
            value={value}
        >
            {children}

            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(
        NotificationContext
    );

    if (!context) {
        throw new Error(
            "useNotification must be used inside NotificationProvider"
        );
    }

    return context;
}

function NotificationContainer({
    notifications,
    onRemove,
}) {
    return (
        <div className="notification-container">
            {notifications.map(
                (notification) => (
                    <div
                        key={notification.id}
                        className={`notification notification-${notification.type}`}
                    >
                        <div className="notification-icon">
                            {notification.type ===
                                "success" && "✓"}

                            {notification.type ===
                                "error" && "!"}

                            {notification.type ===
                                "info" && "i"}
                        </div>

                        <span className="notification-message">
                            {notification.message}
                        </span>

                        <button
                            className="notification-close"
                            onClick={() =>
                                onRemove(
                                    notification.id
                                )
                            }
                        >
                            ×
                        </button>
                    </div>
                )
            )}
        </div>
    );
}