import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { hasPermission } from "../auth/authorization";

function RequirePermission({ permission }) {

    const { user } = useAuth();

    if (!hasPermission(user, permission)) {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RequirePermission;