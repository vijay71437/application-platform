import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";
import RequireRole from "./RequireRole";

import AppLayout from "../layouts/AppLayout";

import AdminPage from "../pages/AdminPage";
import CreateUserPage from "../pages/CreateUserPage";
import EditUserPage from "../pages/EditUserPage";
import UsersPage from "../pages/UsersPage";

import CreatePermissionPage from "../pages/CreatePermissionPage";
import EditPermissionPage from "../pages/EditPermissionPage";
import PermissionsPage from "../pages/PermissionsPage";

import CreateRolePage from "../pages/CreateRolePage";
import EditRolePage from "../pages/EditRolePage";
import RolesPage from "../pages/RolesPage";

import RolePermissionsPage from "../pages/RolePermissionsPage";
import UserRolesPage from "../pages/UserRolesPage";

// Finance Pages
import FinanceDashboardPage from "../pages/finance/FinanceDashboardPage";
import FinanceAccountsPage from "../pages/finance/FinanceAccountsPage";
import FinanceCategoriesPage from "../pages/finance/FinanceCategoriesPage";
import FinanceTransactionsPage from "../pages/finance/FinanceTransactionsPage";
import FinanceRecurringPage from "../pages/finance/FinanceRecurringPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route
                            path="/"
                            element={<DashboardPage />}
                        />

                        {/* Finance Services Routes */}
                        <Route
                            path="/finance"
                            element={<FinanceDashboardPage />}
                        />
                        <Route
                            path="/finance/accounts"
                            element={<FinanceAccountsPage />}
                        />
                        <Route
                            path="/finance/categories"
                            element={<FinanceCategoriesPage />}
                        />
                        <Route
                            path="/finance/transactions"
                            element={<FinanceTransactionsPage />}
                        />
                        <Route
                            path="/finance/recurring"
                            element={<FinanceRecurringPage />}
                        />

                        {/* User Routes */}
                        <Route
                            element={
                                <RequirePermission permission="USER_CREATE" />
                            }
                        >
                            <Route
                                path="/users/new"
                                element={<CreateUserPage />}
                            />
                        </Route>

                        <Route
                            element={
                                <RequirePermission permission="USER_UPDATE" />
                            }
                        >
                            <Route
                                path="/users/:id/edit"
                                element={<EditUserPage />}
                            />
                        </Route>

                        <Route
                            element={
                                <RequirePermission permission="USER_READ" />
                            }
                        >
                            <Route
                                path="/users"
                                element={<UsersPage />}
                            />
                        </Route>

                        {/* Admin Routes */}
                        <Route
                            element={
                                <RequireRole role="ROLE_ADMIN" />
                            }
                        >
                            <Route
                                path="/admin"
                                element={<AdminPage />}
                            />

                            <Route
                                path="/roles"
                                element={<RolesPage />}
                            />

                            <Route
                                path="/roles/new"
                                element={<CreateRolePage />}
                            />

                            <Route
                                path="/roles/:id/edit"
                                element={<EditRolePage />}
                            />

                            <Route
                                path="/roles/:id/permissions"
                                element={<RolePermissionsPage />}
                            />

                            <Route
                                path="/permissions"
                                element={<PermissionsPage />}
                            />

                            <Route
                                path="/permissions/new"
                                element={<CreatePermissionPage />}
                            />

                            <Route
                                path="/permissions/:id/edit"
                                element={<EditPermissionPage />}
                            />

                            <Route
                                path="/users/:id/roles"
                                element={<UserRolesPage />}
                            />
                        </Route>

                        {/* Status Routes */}
                        <Route
                            path="/forbidden"
                            element={<ForbiddenPage />}
                        />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
