import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import {
  NotificationProvider,
} from "./components/notifications/NotificationContext";
import "./components/ui/ui.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <NotificationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </NotificationProvider>
    </React.StrictMode>
);