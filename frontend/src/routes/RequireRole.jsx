import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { hasRole } from "../auth/authorization";

function RequireRole({ role }) {

    const { user } = useAuth();

    if (!hasRole(user, role)) {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RequireRole;