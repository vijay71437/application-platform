import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../layouts/AppLayout";
import AdminPage from "../pages/AdminPage";
import RequireRole from "./RequireRole";

import UsersPage from "../pages/UsersPage";
import RequirePermission from "./RequirePermission";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

               <Route element={<ProtectedRoute />}>

    <Route element={<AppLayout />}>

        <Route
            path="/"
            element={<DashboardPage />}
        />

        <Route
            element={
                <RequirePermission
                    permission="USER_READ"
                />
            }
        >
            <Route
                path="/users"
                element={<UsersPage />}
            />
        </Route>

        <Route
            element={
                <RequireRole role="ROLE_ADMIN" />
            }
        >
            <Route
                path="/admin"
                element={<AdminPage />}
            />
        </Route>

    </Route>

</Route>



                <Route
                    path="/forbidden"
                    element={<ForbiddenPage />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;